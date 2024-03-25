// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path from 'path';
// Your extension is activated the very first time the command is executed
// This method is called when your extension is activated
function getActiveEditorRelativePath() {
	let activeTextEditor = vscode.window.activeTextEditor ;
	if (activeTextEditor !== undefined){
		var uri = activeTextEditor.document.uri;
		var relativePath = vscode.workspace.asRelativePath(uri);

		return relativePath;
	}
	else {
		vscode.window.showInformationMessage('Active Text Editor not found, open a text and try again');
	}
}

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	//Create output channel
	let orange = vscode.window.createOutputChannel("Orange");

	//Write to output.
	orange.appendLine('Congratulations, your extension "fzf-line" is now active!');
	orange.appendLine('if use pwsh, the version of pwsh had better higher then 7.4.1 for avoid the chinese text garbled');
	let relativePath = getActiveEditorRelativePath();
	if (relativePath !== undefined)
	{
		let message = `relative path: ${relativePath}` ;
		vscode.window.showInformationMessage(message);
	}


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fzf-line.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from fzf-line!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
