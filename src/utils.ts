import * as vscode from 'vscode';
export function getActiveEditor() {
    let activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor !== undefined) {
        return activeTextEditor;
    }
    vscode.window.showInformationMessage('Active Text Editor not found, open a text and try again');
    return undefined;
}
export function getActiveEditorRelativePath() {
    let activeTextEditor = getActiveEditor();
    if (activeTextEditor === undefined) {
        return undefined;
    }

    var uri = activeTextEditor.document.uri;
    var relativePath = vscode.workspace.asRelativePath(uri);
    return relativePath;
}

export function getActiveWorkspacePath() {
    let activeTextEditor = getActiveEditor();
    if (activeTextEditor === undefined) {
        return undefined;
    }
    var uri = activeTextEditor.document.uri;
    var workspace = vscode.workspace.getWorkspaceFolder(uri);
    if (workspace === undefined) {
        vscode.window.showInformationMessage(`Active Text Editor doesn't match any workspace folder`);
        return undefined;
    }
    return workspace.uri.fsPath;
}

export function isTerminalAlive(terminal: vscode.Terminal): boolean {
    return vscode.window.terminals.some(t => t === terminal);
}
export function isWindows() {
    return process.platform === 'win32';
}
