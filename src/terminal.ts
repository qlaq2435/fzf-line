import * as vscode from 'vscode';

import * as utils from './utils';

export class FzfLineTerminal {
    static terminal: vscode.Terminal;
    static option: vscode.TerminalOptions;
    static getOptions() {
        if (FzfLineTerminal.option === undefined) {
            FzfLineTerminal.option = {
                name: 'fzf_line',
                shellPath: 'pwsh', // 或者你希望使用的 shell 的路径  
                shellArgs: ['-NoProfile'], // 可选的 shell 参数  
                cwd: utils.getActiveWorkspacePath(), // 初始工作目录  
                env: {
                }
            };
        }
        return FzfLineTerminal.option;
    }
    static getTerminal() {
        if (FzfLineTerminal.terminal === undefined || !utils.isTerminalAlive(FzfLineTerminal.terminal)) {
            // create terminal
            FzfLineTerminal.terminal = vscode.window.createTerminal(FzfLineTerminal.getOptions());
        }
        return FzfLineTerminal.terminal;
    }
}