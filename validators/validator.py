import os
import re
import sys
import argparse
from typing import List, Dict, Any, Tuple, Set

class AIMDValidator:
    """
    AIMD (AI-Enhanced Markdown) v1.5 Syntax Validator.
    Checks for required frontmatter, core blocks, and canonical line formats (ref, @date).
    """
    
    REQUIRED_FRONTMATTER_KEYS = ['aimd', 'src', 'id']
    REQUIRED_BLOCKS = ['intent', 'rules', 'state', 'flow']
    
    # Matches a block start, e.g., :::intent
    BLOCK_REGEX = re.compile(r'^:::([a-z]+)(.*)$')
    # Matches a block end, e.g., :::
    BLOCK_END_REGEX = re.compile(r'^:::\s*$')
    # Matches canonical line format: <line-id>: <payload> [ref(...)] [@YYYY-MM-DD]
    # Captures: 1: ID, 2: Payload, 3: (Optional) ref contents, 4: (Optional) date
    LINE_ID_REGEX = re.compile(r'^([a-z]+\d+):\s*(.*?)(?:\s+ref\(([^)]+)\))?(?:\s+@(\d{4}-\d{2}-\d{2}))?\s*$', re.IGNORECASE)

    def __init__(self, filepath: str):
        self.filepath = filepath
        self.lines: List[str] = []
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.found_ids = set()
        self.referenced_ids = []

    def validate(self) -> bool:
        if not os.path.exists(self.filepath):
            self.errors.append(f"File not found: {self.filepath}")
            return False

        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                self.lines = f.readlines()
        except Exception as e:
            self.errors.append(f"Failed to read file: {str(e)}")
            return False

        self._check_frontmatter()
        self._check_blocks_and_lines()
        self._check_referential_integrity()
        
        return len(self.errors) == 0

    def _check_frontmatter(self):
        if len(self.lines) < 2 or not self.lines[0].startswith('---'):
            self.errors.append("Missing YAML frontmatter at the start of the file.")
            return

        frontmatter_ended = False
        parsed_keys = {}
        
        for i in range(1, len(self.lines)):
            line = self.lines[i].strip()
            if line == '---':
                frontmatter_ended = True
                break
            
            if ':' in line:
                parts = line.split(':', 1)
                key = parts[0].strip()
                val = parts[1].strip().strip('"').strip("'")
                parsed_keys[key] = val

        if not frontmatter_ended:
            self.errors.append("Frontmatter not properly closed with '---'.")
            
        for req_key in self.REQUIRED_FRONTMATTER_KEYS:
            if req_key not in parsed_keys:
                self.errors.append(f"Missing required frontmatter key: '{req_key}'.")
            elif req_key == 'aimd' and parsed_keys['aimd'] != '1.5':
                self.warnings.append(f"AIMD version is '{parsed_keys['aimd']}', but this validator targeted v1.5.")

    def _check_blocks_and_lines(self):
        found_blocks = set()
        current_block = None
        
        for i, line in enumerate(self.lines):
            raw_line = line.strip()
            if not raw_line: continue
            
            # Check for block start
            block_match = self.BLOCK_REGEX.match(raw_line)
            if block_match:
                if current_block:
                    self.errors.append(f"Line {i+1}: Nested or unclosed block '{current_block}' before starting '{block_match.group(1)}'.")
                current_block = block_match.group(1)
                found_blocks.add(current_block)
                continue
                
            # Check for block end
            if self.BLOCK_END_REGEX.match(raw_line):
                if not current_block:
                    self.errors.append(f"Line {i+1}: Closing ':::' found without an open block.")
                current_block = None
                continue

            # Check lines inside core blocks
            if current_block in self.REQUIRED_BLOCKS or current_block == 'test':
                line_match = self.LINE_ID_REGEX.match(raw_line)
                if line_match:
                    line_id = line_match.group(1).lower()
                    self.found_ids.add(line_id)
                    
                    refs = line_match.group(3)
                    if refs:
                        for r in refs.split(','):
                            self.referenced_ids.append((i+1, line_id, r.strip().lower()))
                else:
                    self.errors.append(f"Line {i+1}: Invalid canonical line format in block '{current_block}'. Expected '<id>: <payload> [ref()] [@date]', got '{raw_line}'")

        if current_block:
             self.errors.append(f"Unclosed block at end of file: '{current_block}'.")

        for req_block in self.REQUIRED_BLOCKS:
            if req_block not in found_blocks:
                self.warnings.append(f"Missing recommended core block: ':::{req_block}'.")

    def _check_referential_integrity(self):
        for line_num, source_id, ref_id in self.referenced_ids:
            if ref_id not in self.found_ids:
                # We categorize this as an error in v1.5 (Semantic consistency failure)
                self.errors.append(f"Line {line_num}: Referenced ID '{ref_id}' (by {source_id}) not found in the document.")

    def report(self):
        print(f"--- Validation Report for {os.path.basename(self.filepath)} ---")
        if not self.errors and not self.warnings:
            print("✅ PASS: No syntax errors or warnings found! (v1.5 Compliant)")
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
    parser = argparse.ArgumentParser(description="AIMD v1.5 Syntax Validator")
    parser.add_argument("file", help="Path to the .aimd file to validate")
    args = parser.parse_args()

    validator = AIMDValidator(args.file)
    is_valid = validator.validate()
    validator.report()
    
    if not is_valid:
        sys.exit(1)

if __name__ == "__main__":
    main()
