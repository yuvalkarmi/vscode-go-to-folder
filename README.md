# Go to Folder

Quick fuzzy search to navigate to any folder in your workspace.

## Features

- **Fuzzy Search**: Find folders with non-contiguous character matching (e.g., type "srcabout" to find "src/app/about")
- **Workspace-wide Search**: Always starts at the workspace root and searches all subfolders
- **Smart Exclusions**: Automatically excludes `node_modules`, `.git`, `dist`, `build`, and other common directories
- **Multi-workspace Support**: Search across all workspace folders when multiple are open
- **Fast Keyboard Shortcut**: `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac)

## Usage

### Quick Open with Keyboard Shortcut

Press `Ctrl+Shift+O` (`Cmd+Shift+O` on Mac) to open the folder finder, then start typing to fuzzy search:

- Type any characters from the folder path
- Characters don't need to be consecutive
- Results are ranked by match quality
- Select a folder to reveal it in the Explorer sidebar

### From Command Palette

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Go to Folder"
3. Start typing to search folders

## Examples

Given a folder structure:

```
workspace/
  ├── src/
  │   ├── app/
  │   │   ├── about/
  │   │   └── home/
  │   └── components/
  └── tests/
```

- Type `srcabout` → finds `src/app/about`
- Type `comp` → finds `src/components`
- Type `tst` → finds `tests`

## Excluded Directories

The following directories are automatically excluded from search:

- `node_modules`
- `.git`
- `dist`, `build`, `out`
- `.vscode`
- `vendor`, `target`
- `.next`, `.svelte-kit`
- `coverage`, `.cache`, `.parcel-cache`, `.turbo`

## Configuration

The extension searches up to 10 levels deep by default to balance performance and coverage.

---

_Credit: The project structure and initial inspiration for this extension are based on [Go to Folder](https://github.com/zjffun/vscode-go-to-folder) by zjffun. The extension code has been completely rewritten._
