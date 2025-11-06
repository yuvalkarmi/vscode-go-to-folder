import * as vscode from "vscode";

import openFolder, { openFolderId } from "./commands/openFolder";

export const log = vscode.window.createOutputChannel("Go to Folder");

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(openFolderId, openFolder),
  );
}

export function deactivate() {}
