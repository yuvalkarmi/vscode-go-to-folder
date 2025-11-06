# Go to Folder

Quick fuzzy search to navigate to any folder in your workspace.

## Features

- **Fuzzy Search**: Find folders with non-contiguous character matching (e.g., type "srcabout" to find "src/app/about")
- **Workspace-wide Search**: Always starts at the workspace root and searches all subfolders
- **Smart Exclusions**: Respects your VS Code `files.exclude` and `search.exclude` settings
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

The extension respects your VS Code exclusion settings:

- **Files: Exclude** - Standard file explorer exclusions
- **Search: Exclude** - Search-specific exclusions

This means any folders you've excluded in your VS Code settings (like `node_modules`, `.git`, `dist`, etc.) will automatically be filtered from the folder list. You can customize these exclusions in your VS Code settings.

## Configuration

The extension searches up to 10 levels deep by default to balance performance and coverage.

---

_Credit: The project structure and initial inspiration for this extension are based on [Go to Folder](https://github.com/zjffun/vscode-go-to-folder) by zjffun. The extension code has been completely rewritten._
