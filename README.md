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
- `MM` - Month with a leading zero (`01-12`)
- `M` - Month without a leading zero (`1-12`)
- `DD` - Day of month with a leading zero (`01-31`)
- `D` - Day of month without a leading zero (`1-31`)
- `N` - Patch number (auto-increments)
- `MAJORVERSION` / `MINORVERSION` - Custom semantic versions stored in `version.json`

Update `majorVersion` / `minorVersion` inside `version.json` whenever you want to bump those values:

```json
{
  "version": "25.11.1",
  "majorVersion": 2,
  "minorVersion": 1
}
```

**Available Formats:**

| Format | Example | Description |
|--------|---------|-------------|
| `YY.MM.N` | `25.11.1` | Default: 2-digit year, zero-padded month, patch |
| `YY.M.N` | `25.11.1` | Month without leading zero |
| `YYYY.MM.DD.N` | `2025.11.05.1` | Full year with zero-padded month/day |
| `MM.YY.N` | `11.25.1` | Month first, 2-digit year |
| `N` | `1` | Patch only (simple counter) |
| `MAJORVERSION.MINORVERSION.YY.MM.N` | `1.0.25.11.1` | Combine semantic + date |
| `YYYY.N` | `2025.1` | Full year and patch only |

**Reset Behavior:**
- Formats with **year + month/day**: Resets patch to 1 when any referenced date part changes
- Formats with **year only**: Resets patch to 1 on new year
- Formats with **month only**: Resets patch to 1 on new month
- Formats with **day only**: Resets patch to 1 every day
- Formats with **patch only** (`N`): Never resets, always increments

**Examples:**

```json
// Semantic-like versioning with full year
{
  "format": "YYYY.MM.N"
}
// → 2025.11.1, 2025.11.2, 2025.12.1

// Month without a leading zero
{
  "format": "YY.M.N"
}
// → 25.11.1, 25.12.1

// Daily build numbers
{
  "format": "YYYY.MM.DD.N"
}
// → 2025.11.05.1, 2025.11.05.2, 2025.11.06.1

// Prefix with manual semantic version
{
  "format": "MAJORVERSION.MINORVERSION.YY.MM.N"
}
// → 1.0.25.11.1, 1.0.25.11.2
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
