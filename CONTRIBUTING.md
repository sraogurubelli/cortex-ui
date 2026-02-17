# Contributing to Cortex UI

Thank you for your interest in contributing to Cortex UI!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/cortex-ui.git`
3. Install dependencies: `pnpm install && pnpm deps`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:design-system
```

### Testing

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
cd packages/core && pnpm test
```

### Linting

```bash
pnpm lint
```

## Package Structure

- `packages/core/` - Core AI/agentic UI components
- `packages/design-system/` - Design system (forked from canary)

## Contribution Guidelines

1. **Code Style**: Follow existing code style and use Prettier
2. **TypeScript**: Use TypeScript for all new code
3. **Components**: Keep components small, focused, and reusable
4. **Documentation**: Add JSDoc comments for public APIs
5. **Tests**: Add tests for new components and features
6. **Commits**: Use conventional commit messages

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md (if applicable)
5. Submit pull request with clear description

## Design System Package

The `design-system` package is forked from Harness Canary. When contributing to this package:

- Document any customizations in `CHANGES.md`
- Follow upstream patterns when possible
- Test thoroughly after upstream syncs

## Questions?

Open an issue for questions or discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
