# Contributing to AIMD

First off, thank you for considering contributing to AIMD! It's people like you who make AIMD a better standard for everyone.

## How Can I Contribute?

### Reporting Bugs
If you find a bug in the specification, validators, or examples, please open an issue on GitHub. Include:
* A clear and descriptive title.
* Steps to reproduce the issue.
* Expected vs. actual behavior.

### Suggesting Improvements
We welcome suggestions for the AIMD specification (v1.4 and beyond). To suggest an improvement:
1. Open an issue to discuss the change.
2. Provide a clear rationale for why the change is needed.
3. Show examples of how the change would look in an `.aimd` file.

### Pull Requests
1. Fork the repository.
2. Create a new branch for your changes (`git checkout -b feature/amazing-feature`).
3. If you are adding or modifying `.aimd` examples, please run the validator first:
   ```bash
   python validator.py examples/your-file.aimd
   ```
4. Commit your changes with a clear message.
5. Push to the branch.
6. Open a Pull Request.

## Practical Guidelines

* **Keep it Canonical**: Remember the goal of AIMD is AI-to-AI communication. Avoid adding unnecessary prose or complexity.
* **Token Efficiency**: Every new rule or block should be evaluated for its token cost impact.
* **Stability**: Avoid breaking changes to line-id formats or core block structures unless absolutely necessary for the next major version.

## License

By contributing to AIMD, you agree that your contributions will be licensed under the **Apache License 2.0**.

---

Thank you for helping us build the future of AI-to-AI communication!
