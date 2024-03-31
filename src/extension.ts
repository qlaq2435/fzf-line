// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path from 'path';
import { RG, FzF, echo, CommandLineBuilder } from './cmd';
import { FzfLineTerminal } from './terminal';
import * as utils from './utils';

function getFzfMatchLineCMD(fzfLineTerminal: FzfLineTerminal) {
	let cmdLineBuilder = new CommandLineBuilder();
	cmdLineBuilder
		.command(new RG().showLineNumber().showColumn().showColor().matchLines().setScope(utils.getActiveEditorRelativePath()))
		.pipe()
		.command(new FzF().parseANSI().fuzzyMatch(true).showColor(FzF.defaultColorOption).delimiter(":").preview().reverse())
		.redirect(fzfLineTerminal.getPipe())
		.append()
		.command(new echo().content("finished"))
		.redirect(fzfLineTerminal.getPipe());
	return cmdLineBuilder;
}

function jumpToLineInFile(uri: vscode.Uri, lineNumber: number) {
	// try open document
	vscode.window.showTextDocument(uri).then((ed) => {
		let start = new vscode.Position(lineNumber, 0);
		ed.selection = new vscode.Selection(start, start);
		ed.revealRange(new vscode.Range(start, start), vscode.TextEditorRevealType.InCenter);
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	//Create output channel
	let fzfLineChannel = vscode.window.createOutputChannel("fzf_line");
	let fzfLineTerminal = FzfLineTerminal.getInstance();

	//Write to output.
	fzfLineChannel.appendLine('Congratulations, your extension "fzf-line" is now active!');
	fzfLineChannel.appendLine('if use pwsh, the version of pwsh had better higher then 7.4.1 for avoid the chinese text garbled');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fzf-line.fzf-match-lines', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let activeEditor = utils.getActiveEditor();
		if (activeEditor !== undefined) {
			//  sent cmd to terminal exec
			fzfLineTerminal.getTerminal().show();
			let fzfMatchLineCMD = getFzfMatchLineCMD(fzfLineTerminal);
			fzfLineTerminal.executeCommand(fzfMatchLineCMD, (data: Buffer) => {
				let match = data.toString();
				if (match.length > 0) {
					let line = match.split(`:`)[0];
					fzfLineChannel.appendLine(line);
					jumpToLineInFile(activeEditor!.document.uri, Number(line) - 1);
				}
				fzfLineTerminal.getTerminal().hide();
			});
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
