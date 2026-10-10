# Contributing to PERSONA_PRIME

Thank you for your interest in contributing to PERSONA_PRIME. We welcome improvements, bug fixes, documentation, and feature ideas from the community. This guide outlines how to contribute effectively and professionally.

## Code of Conduct

We expect all contributors to be respectful, constructive, and collaborative. Please keep discussions focused on improving the project and helping others.

## How to Contribute

### Reporting Bugs

Before opening a bug report, please check whether the issue already exists.

When reporting a bug, please include:
- A clear title
- A description of the issue
- Steps to reproduce it
- Expected vs actual behavior
- Screenshots or logs if relevant
- Environment details such as OS, runtime, and dependency versions

### Suggesting Features or Enhancements

Feature requests are welcome. Please open an issue describing:
- The problem you want to solve
- Why the change would be useful
- Any examples or mockups if available
- Potential trade-offs or edge cases

### Pull Requests

We welcome pull requests that improve quality, functionality, or documentation.

Before submitting a PR:
1. Fork the repository and create a feature branch
2. Keep changes focused and scoped to the task
3. Follow the project’s coding style and standards
4. Add or update tests where appropriate
5. Update documentation if behavior or setup changes
6. Ensure the code builds and tests pass locally

## Development Setup

### Prerequisites

- Git
- Python 3.10+ (if applicable to this project)
- A virtual environment tool such as `venv` or `virtualenv`

### Local Setup

```bash
git clone https://github.com/logiclayer0/PERSONA_PRIME.git
cd PERSONA_PRIME
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

If the project uses different setup instructions, follow the repository-specific README and local environment requirements.

## Coding Standards

- Write clear, readable, and maintainable code
- Prefer small, focused commits
- Use meaningful variable and function names
- Follow language-appropriate style conventions
- Keep comments useful and concise
- Add tests for bug fixes and new functionality when feasible

## Commit Guidelines

Use clear, professional commit messages that describe the change.

Examples:
- `feat: add user preference panel`
- `fix: resolve duplicate task creation bug`
- `docs: update contribution instructions`

## Testing

Before submitting a PR, run the relevant tests and confirm the result is stable.

Typical commands may include:

```bash
pytest
```

If the project uses a different test runner or command, follow the project README.

## Documentation

Documentation is part of the contribution process. If your change modifies behavior, installation steps, or configuration, update the docs accordingly.

## Review Process

Once you open a PR:
- Maintainers may request changes
- You should respond promptly and professionally
- Keep discussions focused on the code and the issue being solved
- Be open to feedback and improvements

## Questions

If you are unsure about anything, please open an issue or ask for clarification before starting work on a large change.

## License

By contributing to PERSONA_PRIME, you agree that your contributions will be licensed under the repository’s existing license.

Thank you for helping improve PERSONA_PRIME.
