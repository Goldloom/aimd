# Contributing to AIMD (v1.5)

First off, thank you for considering contributing to AIMD! It's people like you who make AIMD a better standard for everyone.

## How Can I Contribute?

### Reporting Bugs
If you find a bug in the specification, validators, or examples, please open an issue on GitHub. Include:
* A clear and descriptive title.
* Steps to reproduce the issue (including the AIMD version you're using).
* Expected vs. actual behavior.

### Suggesting Improvements
We welcome suggestions for the AIMD specification (v1.5 and beyond). To suggest an improvement:
1. Open an issue to discuss the change.
2. Provide a clear rationale for why the change is needed.
3. Show examples of how the change would look in an `.aimd` file using `ref()` and `:::test`.

### Pull Requests
1. Fork the repository.
2. Create a new branch for your changes (`git checkout -b feature/amazing-feature`).
3. If you are adding or modifying `.aimd` examples, **MUST** run the validator first:
   ```bash
   python validators/validator.py examples/your-file.aimd
   ```
4. Verify **Referential Integrity**: ensure all `ref()` IDs point to valid lines.
5. Commit your changes with a clear message.
6. Push to the branch.
7. Open a Pull Request.

## Practical Guidelines (v1.5)

* **Verifiable Precision**: Use `ref(id)` to link dependencies. Do not let the next agent guess.
* **Keep it Canonical**: Remember the goal of AIMD is AI-to-AI communication. Avoid adding unnecessary prose.
* **Token Efficiency**: Every new rule or block should be evaluated for its token cost impact.
* **Maintain Stability**: Always track completion evidence on `v` lines using `@YYYY-MM-DD`.
* **Tests are First-Class**: New features or rules SHOULD include a corresponding `:::test` assertion.

## License

By contributing to AIMD, you agree that your contributions will be licensed under the **Apache License 2.0**.

---

Thank you for helping us build the future of **Verifiable AI-to-AI Memory**!
