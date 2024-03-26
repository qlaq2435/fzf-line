import * as vscode from 'vscode';
import path from 'path';
import * as net from 'net';

import * as utils from './utils';

export class FzfPipe {
    pipe: string | undefined;
    fzfPipeScript() {
        let fzfPipeScript = vscode.extensions.getExtension('qlaq2435.fzf-line')?.extensionPath ?? "D:/Project/fzf-line";
        fzfPipeScript = path.join(fzfPipeScript, 'scripts', 'topipe.' + (utils.isWindows() ? "bat" : "sh"));
        return fzfPipeScript;
    }
    constructor(consumer:(data:Buffer)=> void){
        if (utils.isWindows()) {
            this.setupWindowsPipe(consumer);
        }
    }
    setupWindowsPipe(consumer:(data:Buffer)=> void) {
        let server = net.createServer((socket) => {
            socket.on('data', (data) => {
                consumer(data);
            })
        });
        let idx = 0;
        while (!this.pipe) {
            try {
                let pipe = `\\\\?\\pipe\\fzf-pipe-${process.pid}`;
                if (idx > 0) { pipe += `-${idx}`; }
                server.listen(pipe);
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
    }

}