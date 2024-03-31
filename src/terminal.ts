import * as vscode from 'vscode';
import { exec } from "child_process";
import * as net from 'net';

import * as utils from './utils';
import { CommandLineBuilder, FzF } from './cmd';

export class FzfLineTerminal {
    private static instance: FzfLineTerminal;
    private static option: vscode.TerminalOptions;

    // 私有构造函数，防止在类外部使用 new Singleton() 创建实例  
    private constructor() { }

    private terminal?: vscode.Terminal;
    private pipe?: string;
    private server?: net.Server;
    private static getOptions() {
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

    // 公开的静态方法用于获取单例实例  
    public static getInstance(): FzfLineTerminal {
        if (!FzfLineTerminal.instance) {
            FzfLineTerminal.instance = new FzfLineTerminal();
            // 可以在这里执行其他初始化操作，比如创建终端等  
            FzfLineTerminal.instance.getTerminal();
            FzfLineTerminal.instance.getPipe();
            FzfLineTerminal.instance.getServer();
        }
        return FzfLineTerminal.instance;
    }

    getTerminal(): vscode.Terminal {
        if (this.terminal === undefined || !utils.isTerminalAlive(this.terminal)) {
            this.terminal = vscode.window.createTerminal(FzfLineTerminal.getOptions());
        }
        return this.terminal;
    }

    getServer(): net.Server {
        if (this.server === undefined || this.server === null) {
            this.server = net.createServer((socket) => {
                socket.on('data', (data) => {
                    this.pipeConsumer?.(data);
                });
            });
        }
        if (!this.server.listening) {
            this.server.listen(this.getPipe());
        }
        return this.server;
    }

    getPipe() {
        // if (utils.isWindows()) {
        // }
        return this.windowsPipe();
    }
    windowsPipe() {
        let idx = 0;
        while (!this.pipe) {
            try {
                let pipe = `\\\\.\\\\pipe\\fzf-pipe-${process.pid}`;
                if (idx > 0) { pipe += `-${idx}`; }
                this.pipe = pipe;
            } catch (e: any) {
                if (e.code === 'EADDRINUSE') {
                    // Try again for a new address
                    ++idx;
                } else {
                    // Bad news
                    throw e;
                }
            }
        }
        return this.pipe;
    }

    executeCommand(cmdline: CommandLineBuilder, onExecResult: (data: Buffer) => void) {
        let commandLine = cmdline.build();
        this.currentPipeConsumer = onExecResult;
        this.getTerminal().sendText(commandLine, true);
    }

    currentPipeConsumer?: (data: Buffer) => void;
    pipeConsumer(data: Buffer): void {
        this.currentPipeConsumer?.(data);
    }
}