import * as vscode from "vscode";

interface FolderQuickPickItem extends vscode.QuickPickItem {
  uri: vscode.Uri;
}

// Directories to exclude from folder search
const excludedDirs = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "out",
  ".vscode",
  "vendor",
  "target",
  ".next",
  ".svelte-kit",
  "coverage",
  ".cache",
  ".parcel-cache",
  ".turbo",
]);

// Maximum depth for recursive folder search
const MAX_SEARCH_DEPTH = 10;

interface FolderWithPath {
  uri: vscode.Uri;
  relativePath: string;
}

/**
 * Recursively collects all folders from a given URI
 */
async function collectAllFolders(
  uri: vscode.Uri,
  workspaceRoot: vscode.Uri,
  depth: number = 0,
): Promise<FolderWithPath[]> {
  if (depth > MAX_SEARCH_DEPTH) {
    return [];
  }

  const folders: FolderWithPath[] = [];

  try {
    const items = await vscode.workspace.fs.readDirectory(uri);

    for (const [name, fileType] of items) {
      // Skip if not a directory or if excluded
      if (!(fileType & vscode.FileType.Directory) || excludedDirs.has(name)) {
        continue;
      }

      const folderUri = vscode.Uri.joinPath(uri, name);
      const relativePath = folderUri.path.replace(workspaceRoot.path + "/", "");

      folders.push({
        uri: folderUri,
        relativePath,
      });

      // Recursively collect subfolders
      const subfolders = await collectAllFolders(
        folderUri,
        workspaceRoot,
        depth + 1,
      );
      folders.push(...subfolders);
    }
  } catch (error) {
    // Silently skip folders we can't read (permissions, etc.)
  }

  return folders;
}

/**
 * Fuzzy match algorithm - matches non-contiguous characters in order
 * Example: "srcabout" matches "src/app/about"
 */
function fuzzyMatch(query: string, path: string): number | null {
  if (!query) {
    return 0;
  }

  const queryLower = query.toLowerCase();
  const pathLower = path.toLowerCase();

  let queryIndex = 0;
  let pathIndex = 0;
  let score = 0;
  let lastMatchIndex = -1;

  while (queryIndex < queryLower.length && pathIndex < pathLower.length) {
    if (queryLower[queryIndex] === pathLower[pathIndex]) {
      // Bonus points for consecutive matches
      if (lastMatchIndex === pathIndex - 1) {
        score += 5;
      }
      // Bonus for matching after a separator
      if (pathIndex > 0 && pathLower[pathIndex - 1] === "/") {
        score += 3;
      }
      score += 1;
      lastMatchIndex = pathIndex;
      queryIndex++;
    }
    pathIndex++;
  }

  // If we didn't match all query characters, no match
  if (queryIndex < queryLower.length) {
    return null;
  }

  return score;
}

const quickPick = vscode.window.createQuickPick<FolderQuickPickItem>();

// Cache for all folders to enable fuzzy filtering
let allFolderItems: FolderQuickPickItem[] = [];

quickPick.placeholder = "Search folders by name";

quickPick.onDidAccept(
  getShowErrorFunction(async () => {
    const item = quickPick?.selectedItems?.[0];
    if (item) {
      await acceptItem(item);
    }
  }),
);

// Set up fuzzy matching filter handler once
quickPick.onDidChangeValue((value) => {
  if (!value) {
    // Show all items when no search query
    quickPick.items = allFolderItems;
    return;
  }

  // Filter and sort by fuzzy match score
  const matchedItems = allFolderItems
    .map((item) => ({
      item,
      score: fuzzyMatch(value, item.description || ""),
    }))
    .filter(({ score }) => score !== null)
    .sort((a, b) => (b.score as number) - (a.score as number))
    .map(({ item }) => item);

  quickPick.items = matchedItems;
});

function showError(error: any) {
  vscode.window.showErrorMessage(
    `Go to Folder ${error?.message || error?.toString?.()}`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getShowErrorFunction(this: any, fn: Function) {
  const _this = this;

  return async function (...args: any[]) {
    try {
      // await here, otherwise the error may not be caught.
      const result = await fn.apply(_this, args);
      return result;
    } catch (error: any) {
      showError(error);
    }
  };
}

async function acceptItem(item: FolderQuickPickItem) {
  const uri = item.uri;

  // Reveal the selected folder in the sidebar
  await vscode.commands.executeCommand("revealInExplorer", uri);
  await vscode.commands.executeCommand("list.expand");

  // Close the quick pick
  quickPick.hide();
}

async function showDefaultQuickPick() {
  // Check if workspace folders exist
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage(
      "No workspace folder is open. Please open a folder first.",
    );
    return;
  }

  // Show loading state
  quickPick.busy = true;
  quickPick.placeholder = "Loading folders...";
  quickPick.items = [];
  quickPick.title = "Go to Folder...";
  quickPick.value = "";
  quickPick.show();

  // Collect all folders from all workspace roots
  const allFolders: FolderWithPath[] = [];
  for (const workspace of vscode.workspace.workspaceFolders) {
    const folders = await collectAllFolders(workspace.uri, workspace.uri);

    // Add workspace prefix if multiple workspaces
    const prefix =
      vscode.workspace.workspaceFolders.length > 1 ? `#${workspace.name}/` : "";

    folders.forEach((folder) => {
      allFolders.push({
        uri: folder.uri,
        relativePath: prefix + folder.relativePath,
      });
    });
  }

  // Convert to quick pick items and cache them
  allFolderItems = allFolders.map(({ uri, relativePath }) => ({
    label: relativePath.split("/").pop() || relativePath,
    description: relativePath,
    uri,
  }));

  // Update UI
  quickPick.placeholder = "Type to search folders (fuzzy matching enabled)";
  quickPick.items = allFolderItems;
  quickPick.busy = false;
}

export default getShowErrorFunction(async () => {
  await showDefaultQuickPick();
});

export const openFolderId = "go-to-folder.openFolder";
