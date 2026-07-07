```markdown
# flowstate-v2-dev Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the core development patterns and conventions used in the `flowstate-v2-dev` repository, a TypeScript codebase built on the Next.js framework. You'll learn about file naming, import/export styles, commit message habits, and how to write and locate tests. This guide will help you contribute code that aligns with the project's established standards.

## Coding Conventions

### File Naming
- **PascalCase** is used for file names.
  - Example: `UserProfile.tsx`, `DashboardLayout.ts`
- This applies to both component and utility files.

### Import Style
- **Alias imports** are preferred over relative paths.
  - Example:
    ```typescript
    import { fetchUser } from '@utils/api';
    import Dashboard from '@components/Dashboard';
    ```
  - Aliases are likely configured in `tsconfig.json` or `next.config.js`.

### Export Style
- **Mixed exports** are used:
  - Both default and named exports may appear in the codebase.
  - Example:
    ```typescript
    // Named export
    export function calculateScore() { ... }

    // Default export
    export default function UserProfile() { ... }
    ```

### Commit Message Patterns
- **Freeform** commit messages (no strict prefixing).
- Average commit message length: 83 characters.
- Example:
  ```
  Fix dashboard refresh issue when switching tabs
  ```

## Workflows

_No explicit workflows detected in the repository analysis._

## Testing Patterns

- **Test Framework:** Not detected (unknown).
- **Test File Pattern:** Files matching `*.test.*` are considered test files.
  - Example: `UserProfile.test.tsx`, `apiUtils.test.ts`
- **Test Placement:** Test files are typically placed alongside the code they test or in a dedicated test directory.

#### Example Test File
```typescript
// UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

test('renders user name', () => {
  render(<UserProfile name="Alice" />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

## Commands
| Command | Purpose |
|---------|---------|
| /test   | Run all test files matching `*.test.*` |
| /lint   | Lint the codebase for style and errors |
| /build  | Build the Next.js application         |
```
