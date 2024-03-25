import * as vscode from 'vscode';

export function getActiveEditorRelativePath() {
    let activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor !== undefined) {
        var uri = activeTextEditor.document.uri;
        var relativePath = vscode.workspace.asRelativePath(uri);
        return relativePath;
    }
    vscode.window.showInformationMessage('Active Text Editor not found, open a text and try again');
    return undefined;
}
