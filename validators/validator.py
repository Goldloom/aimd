import os
import re
import sys
import argparse
from typing import List, Dict, Any, Tuple

class AIMDValidator:
    """
    A simple syntax validator for AIMD (AI-Enhanced Markdown) files.
    Checks for required frontmatter, core blocks, and basic line formats.
    """
    
    REQUIRED_FRONTMATTER_KEYS = ['aimd', 'src', 'id']
    REQUIRED_BLOCKS = ['intent', 'rules', 'state', 'flow']
    
    # Matches a block start, e.g., :::intent
    BLOCK_REGEX = re.compile(r'^:::([a-z]+)\s*$')
    # Matches a block end, e.g., :::
    BLOCK_END_REGEX = re.compile(r'^:::\s*$')
    # Matches canonical line format: <line-id>: <payload>
    LINE_ID_REGEX = re.compile(r'^([a-zA-Z0-9_-]+):\s*(.+)$')

    def __init__(self, filepath: str):
        self.filepath = filepath
        self.lines: List[str] = []
        self.errors: List[str] = []
        self.warnings: List[str] = []

    def validate(self) -> bool:
        if not os.path.exists(self.filepath):
            self.errors.append(f"File not found: {self.filepath}")
            return False

        with open(self.filepath, 'r', encoding='utf-8') as f:
            self.lines = f.readlines()

        self._check_frontmatter()
        self._check_blocks()
        
        return len(self.errors) == 0

    def _check_frontmatter(self):
        if len(self.lines) < 2 or not self.lines[0].startswith('---'):
            self.errors.append("Missing YAML frontmatter at the start of the file.")
            return

        frontmatter_ended = False
        parsed_keys = set()
        
        for i in range(1, len(self.lines)):
            line = self.lines[i].strip()
            if line == '---':
                frontmatter_ended = True
                break
            
            if ':' in line:
                key = line.split(':', 1)[0].strip()
                parsed_keys.add(key)

        if not frontmatter_ended:
            self.errors.append("Frontmatter not properly closed with '---'.")
            
        for req_key in self.REQUIRED_FRONTMATTER_KEYS:
            if req_key not in parsed_keys:
                self.errors.append(f"Missing required frontmatter key: '{req_key}'.")

    def _check_blocks(self):
        found_blocks = set()
        current_block = None
        
        for i, line in enumerate(self.lines):
            line = line.strip()
            
            # Check for block start
            block_match = self.BLOCK_REGEX.match(line)
            if block_match:
                if current_block:
                    self.errors.append(f"Line {i+1}: Nested or unclosed block '{current_block}' before starting '{block_match.group(1)}'.")
                current_block = block_match.group(1)
                found_blocks.add(current_block)
                continue
                
            # Check for block end
            if self.BLOCK_END_REGEX.match(line):
                if not current_block:
                    self.errors.append(f"Line {i+1}: Closing ':::' found without an open block.")
                current_block = None
                continue

            # Check lines inside core blocks
            if current_block in self.REQUIRED_BLOCKS and line != '':
                line_match = self.LINE_ID_REGEX.match(line)
                if not line_match:
                    self.errors.append(f"Line {i+1}: Invalid canonical line format in block '{current_block}'. Expected '<line-id>: <payload>', got '{line}'")

        if current_block:
             self.errors.append(f"Unclosed block at end of file: '{current_block}'.")

        # Check if all required blocks are present (Warning instead of error if partial document)
        for req_block in self.REQUIRED_BLOCKS:
            if req_block not in found_blocks:
                self.warnings.append(f"Missing recommended core block: ':::{req_block}'.")

    def report(self):
        print(f"--- Validation Report for {os.path.basename(self.filepath)} ---")
        if not self.errors and not self.warnings:
            print("✅ PASS: No syntax errors or warnings found!")
        else:
            if self.errors:
                print("❌ ERRORS:")
                for err in self.errors:
                    print(f"  - {err}")
            if self.warnings:
                print("⚠️ WARNINGS:")
                for warn in self.warnings:
                    print(f"  - {warn}")
            
            if self.errors:
                print("\nStatus: FAILED")
            else:
                print("\nStatus: PASSED (with warnings)")

def main():
    parser = argparse.ArgumentParser(description="AIMD Syntax Validator")
    parser.add_argument("file", help="Path to the .aimd file to validate")
    args = parser.parse_args()

    validator = AIMDValidator(args.file)
    is_valid = validator.validate()
    validator.report()
    
    if not is_valid:
        sys.exit(1)

if __name__ == "__main__":
    main()
