// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path from 'path';
import { exec } from "child_process";
import { RG, FzF } from './cmd';
import { FzfLineTerminal } from './terminal';
import * as utils from './utils';

function getRgMatchLineCMD() {
	let rg = new RG();
	rg.showLineNumber().showColumn().showColor().matchLines().setScope(utils.getActiveEditorRelativePath());
	let fzf = new FzF();
	fzf.showColor().fuzzyMatch(true);
	return rg.pipe(fzf).commandLine();
}

// function getFzfMatchCMD(file) {
// 	let cmd = `rg --line-number  --column --color=always  "$" ${file} | fzf --ansi --enabled --color "hl:-1:underline,hl+:-1:underline:reverse" --delimiter : --preview "bat --color=always aaa/test.lua  --highlight-line {1} "  --preview-window "right,60%,,+{1}+3/3,~3" --reverse`;

// }


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	//Create output channel
	let fzfLineChannel = vscode.window.createOutputChannel("fzf_line");

	//Write to output.
	fzfLineChannel.appendLine('Congratulations, your extension "fzf-line" is now active!');
	fzfLineChannel.appendLine('if use pwsh, the version of pwsh had better higher then 7.4.1 for avoid the chinese text garbled');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fzf-line.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		let fzfLineTerminal = FzfLineTerminal.getTerminal();
		fzfLineTerminal.show();

		//  sent cmd to terminal exec 
		let rgMatchLineCMD = getRgMatchLineCMD();
		fzfLineTerminal.sendText(rgMatchLineCMD);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
