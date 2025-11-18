# @bucaastudio/versioned-footer

Auto-versioning footer component for React/Next.js with automatic version incrementing on git commits.

## Features

- 🔄 Auto-increments version on every commit
- 🎨 **Customizable version format** (YY.MM.N, YYYY.MM.N, MM.YY.N, N, etc.)
- ⚛️ React/Next.js compatible
- 🌙 Dark mode support
- 📅 Automatic year range calculation
- 🎨 Tailwind CSS styling (customizable)
- 📦 TypeScript support

## Installation

### Option 1: From GitHub (Recommended during development)

```bash
npm install github:bluevisor/versioned-footer
```

### Option 2: From npm (when published)

```bash
npm install @bucaastudio/versioned-footer
```

## Quick Start

### 1. Install the package

```bash
npm install github:bluevisor/versioned-footer
```

### 2. Set up auto-versioning

```bash
npx versioned-footer-setup
```

This will:
- Create `version.json` in your project root
- Install a git pre-commit hook
- Copy the version bumping script

### 3. Use the component

```tsx
import { VersionedFooter } from "@bucaastudio/versioned-footer";

export default function MyPage() {
  return (
    <div>
      <h1>My App</h1>
      {/* Your content */}

      <VersionedFooter
        companyName="Your Company"
        startYear={2024}
      />
    </div>
  );
}
```

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `companyName` | `string` | `"Your Company"` | Company name displayed in footer |
| `startYear` | `number` | Current year | Starting year for copyright |
| `className` | `string` | `""` | Additional CSS classes |
| `showVersion` | `boolean` | `true` | Show/hide version number |

### Examples

```tsx
// Basic usage
<VersionedFooter />

// Custom company and year
<VersionedFooter
  companyName="Acme Corp"
  startYear={2020}
/>

// Without version number
<VersionedFooter showVersion={false} />

// Custom styling
<VersionedFooter
  className="fixed bottom-0 w-full bg-gray-100 dark:bg-gray-900 py-4"
/>
```

## How Versioning Works

The version format is `vYY.MM.N`:
- `YY` = Last 2 digits of year (e.g., 25 for 2025)
- `MM` = Month (1-12)
- `N` = Patch number (increments with each commit)

**Examples:**
- First commit in November 2025: `v25.11.1`
- Next commit same month: `v25.11.2`
- First commit in December 2025: `v25.12.1`

### Customizing Version Format

You can customize the version format by editing `version-config.json` in your project root:

```json
{
  "format": "YYYY.MM.N"
}
```

**Supported Placeholders:**
- `YYYY` - Full year (e.g., 2025)
- `YY` - 2-digit year (e.g., 25)
- `MM` - Month (1-12)
- `N` - Patch number (auto-increments)

**Available Formats:**

| Format | Example | Description |
|--------|---------|-------------|
| `YY.MM.N` | `25.11.1` | Default: 2-digit year, month, patch |
| `YYYY.MM.N` | `2025.11.1` | Full year, month, patch |
| `MM.YY.N` | `11.25.1` | Month first, 2-digit year, patch |
| `MM.YYYY.N` | `11.2025.1` | Month first, full year, patch |
| `N` | `1` | Patch only (simple counter) |
| `YY.N` | `25.1` | Year and patch only |
| `MM.N` | `11.1` | Month and patch only |
| `YYYY.N` | `2025.1` | Full year and patch only |

**Reset Behavior:**
- Formats with **year + month**: Resets patch to 1 when either changes
- Formats with **year only**: Resets patch to 1 on new year
- Formats with **month only**: Resets patch to 1 on new month
- Formats with **patch only** (`N`): Never resets, always increments

**Examples:**

```json
// Semantic-like versioning with full year
{
  "format": "YYYY.MM.N"
}
// → 2025.11.1, 2025.11.2, 2025.12.1

// Month-first format
{
  "format": "MM.YYYY.N"
}
// → 11.2025.1, 11.2025.2, 12.2025.1

// Simple incrementing counter
{
  "format": "N"
}
// → 1, 2, 3, 4, ...

// Year-based versioning
{
  "format": "YYYY.N"
}
// → 2025.1, 2025.2, 2026.1
```

### Manual Version Bump

```bash
node scripts/bump-version.js
```

## Styling

The component uses Tailwind CSS classes. If you're not using Tailwind, you can:

1. Override with custom CSS using `className` prop
2. Style the footer directly in your CSS:

```css
footer p {
  color: #888;
  font-size: 14px;
}

.dark footer p {
  color: #666;
}
```

## Requirements

- React 18+ or React 19+
- Git repository
- Node.js 16+

## Tailwind CSS (Optional)

If using Tailwind CSS, ensure these classes are available:
- `text-sm`, `text-gray-500`, `dark:text-white/30`
- `text-center`, `transition-colors`, `duration-300`

## Troubleshooting

### Hook not running?

```bash
chmod +x .git/hooks/pre-commit
```

### Version not updating?

Check that `version.json` exists in your project root:

```bash
ls -la version.json
```

### TypeScript errors with version.json?

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

## License

MIT © Bucaa Studio

## Repository

[https://github.com/bluevisor/versioned-footer](https://github.com/bluevisor/versioned-footer)
