import * as vscode from 'vscode';
import { exec } from "child_process";

import * as utils from './utils';

export class FzfLineTerminal {
    static terminalSingleton: vscode.Terminal;
    static option: vscode.TerminalOptions;
    static getOptions() {
        if (FzfLineTerminal.option === undefined) {
            FzfLineTerminal.option = {
                name: 'fzf_line',
                shellPath: 'pwsh', // 或者你希望使用的 shell 的路径
                shellArgs: ['-NoProfile'], // 可选的 shell 参数
                cwd: utils.getActiveWorkspacePath(), // 初始工作目录
                env: {}
            };
        }
        return FzfLineTerminal.option;
    }

    static getTerminal() {
        if (FzfLineTerminal.terminalSingleton === undefined || !utils.isTerminalAlive(FzfLineTerminal.terminalSingleton)) {
            // create terminal
            FzfLineTerminal.terminalSingleton = vscode.window.createTerminal(FzfLineTerminal.getOptions());
        }
        return FzfLineTerminal.terminalSingleton;
    }
    static execCmd(cmdline: string, outputChannel: vscode.OutputChannel){
        exec(cmdline, (error, stdout, stderr) => {
            if (error) {
              vscode.window.showErrorMessage(error.message);
              return new Error(error.message);
            }
            if (stderr) {
              vscode.window.showErrorMessage(stderr);
              return new Error(stderr);
            }
            vscode.window.showInformationMessage(stdout);

            // outputChannel.appendLine(stdout);
          });
    }
}