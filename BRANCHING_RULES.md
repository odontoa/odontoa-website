# Odontoa Website - Branching and Versioning Rules

## Branch Structure

### Main Branches
- `main` - The primary branch containing production-ready code
- `develop` - Integration branch for ongoing development

### Feature Branches
- Format: `feature/[feature-name]`
- Created from: `develop`
- Merge into: `develop`
- Example: `feature/user-authentication`

### Release Branches
- Format: `release/v[version]`
- Created from: `develop`
- Merge into: `main` and `develop`
- Example: `release/v1.2.0`

### Hotfix Branches
- Format: `hotfix/[fix-name]`
- Created from: `main`
- Merge into: `main` and `develop`
- Example: `hotfix/login-fix`

## Versioning Rules

We follow [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

1. MAJOR version (x.0.0) - Incompatible API changes
2. MINOR version (0.x.0) - Add functionality in a backward-compatible manner
3. PATCH version (0.0.x) - Backward-compatible bug fixes

### Version Tags
- All releases must be tagged with their version number
- Format: `v[version]` (e.g., `v1.1.0`)

## Workflow Rules

1. **Starting New Work**
   - Create a new feature branch from `develop`
   - Use descriptive branch names

2. **Making Changes**
   - Keep commits atomic and focused
   - Write clear commit messages
   - Update version in `package.json` when appropriate

3. **Code Review**
   - All changes require a pull request
   - At least one review is required
   - All tests must pass

4. **Merging**
   - Feature branches merge into `develop`
   - Release branches merge into both `main` and `develop`
   - Delete branches after merging

5. **Releases**
   - Create a release branch when ready to release
   - Update version numbers
   - Create a git tag after merging to main

## Example Workflow

1. Start new feature:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   ```

2. Complete feature:
   ```bash
   git checkout develop
   git merge feature/new-feature
   git push origin develop
   ```

3. Prepare release:
   ```bash
   git checkout develop
   git checkout -b release/v1.2.0
   # Update version in package.json
   git commit -am "Release version 1.2.0"
   ```

4. Finish release:
   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag -a v1.2.0 -m "Version 1.2.0"
   git push origin main --tags
   ```

## Version History

Keep track of significant changes in the CHANGELOG.md file.

## Questions?

Contact the development team for clarification on these rules. 