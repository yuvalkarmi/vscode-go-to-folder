# v1.1.0

- Now respects VS Code's `files.exclude` and `search.exclude` settings
- Removed hardcoded exclusion list in favor of user-configurable exclusions

# v1.0.0

Initial release of the fuzzy folder finder extension by Yuval Karmi.

## Features

- **Fuzzy Search**: Non-contiguous character matching to quickly find folders
- **Workspace-wide Search**: Automatically searches from workspace root through all subfolders
- **Smart Exclusions**: Excludes common build/vendor directories (node_modules, .git, dist, build, etc.)
- **Multi-workspace Support**: Search across all workspace folders
- **Keyboard Shortcut**: `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac)
- **Folder Reveal**: Selected folders are revealed in the Explorer sidebar

## Technical Details

- Recursive folder collection up to 10 levels deep
- Case-insensitive fuzzy matching with scoring
- No step-by-step navigation - flat list of all folders
- Folder-only search (files removed)
