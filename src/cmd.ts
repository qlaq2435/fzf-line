import *  as utils from "./utils";

class Cmd {
    cmder: string;
    cmdArgs: string;
    producer?: Cmd;
    consumer?: Cmd;
    constructor(cmd: string) {
        this.cmder = cmd;
        this.cmdArgs = "";
    }
    appendArg(param: string | undefined) {
        if (param !== undefined) {
            this.cmdArgs = this.cmdArgs.concat(" ", param);
        }
        return this;
    }
    appendArgs(params: string[] | undefined) {
        params?.forEach((param) => {
            this.appendArg(param);
        });
        return this;
    }
    pipe(consumer: Cmd) {
        consumer.producer = this;
        this.consumer = consumer;
        return consumer;
    }
    commandLine() {
        let cmdline = this.cmder.concat(" ", this.cmdArgs);
        if (this.producer !== undefined) {
            cmdline = this.producer.commandLine().concat(" | ", cmdline);
        }
        return cmdline;
    }
}

export class RG extends Cmd {
    static lineMatchPattern = "$";
    constructor() {
        super(`rg`);
    }
    showLineNumber() {
        return super.appendArg("--line-number");
    }
    showColumn() {
        return super.appendArg("--column");
    }
    showColor() {
        return super.appendArg("--color=always");
    }
    matchLines() {
        return super.appendArg(RG.lineMatchPattern);
    }
    setScope(scope: string | undefined) {
        return super.appendArg(scope);
    }
}


export class FzF extends Cmd {
    static lineMatchPattern = "$";
    static defaultColorOption = "hl:-1:underline,hl+:-1:underline:reverse";
    constructor() {
        super(`fzf`);
    }
    parseANSI() {
        return super.appendArg("--ansi")
    }
    showColor(option: string) {
        return super.appendArg(`--color "${option}"`);
    }
    delimiter (pattern: string){
        // Field delimiter regex (default: AWK-style)
        return super.appendArg(`--delimiter ${pattern}`);
    }
    preview(){
        // require bat install
        super.appendArg(`--preview "bat --color=always ${utils.getActiveEditorRelativePath()}  --highlight-line {1}"`);
        super.appendArg(`--preview-window "right,60%,,+{1}+3/3,~3"`);
        return this;
    }
    reverse() {
        super.appendArg(`--reverse`);
    }
    fuzzyMatch(enabled: boolean) {
        return enabled ? super.appendArg("--enabled") : super.appendArg("--disabled");
    }
}