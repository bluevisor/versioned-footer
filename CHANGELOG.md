# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-11-18

### Added
- **Customizable version formats** via `version-config.json`
- Support for 8+ different version format patterns:
  - `YY.MM.N` - 2-digit year, month, patch (default)
  - `YYYY.MM.N` - Full year, month, patch
  - `MM.YY.N` - Month first, 2-digit year, patch
  - `MM.YYYY.N` - Month first, full year, patch
  - `N` - Patch only (simple counter)
  - `YY.N` - Year and patch only
  - `MM.N` - Month and patch only
  - `YYYY.N` - Full year and patch only
- Dynamic format parsing in `bump-version.js`
- Automatic format configuration copying in setup CLI
- Comprehensive documentation with format examples

### Changed
- Enhanced `bump-version.js` to read and parse custom formats
- Updated `setup-cli.js` to copy `version-config.json`
- Improved README with detailed format customization section
- Added format examples and reset behavior documentation

### Fixed
- Version parsing now handles any format combination
- Reset logic adapts based on format components

## [1.0.0] - 2025-11-18

### Added
- Initial release
- Auto-versioning footer component for React/Next.js
- Automatic version incrementing on git commits
- Dark mode support
- TypeScript support
- Tailwind CSS styling
- Git pre-commit hook integration
- CLI setup tool
