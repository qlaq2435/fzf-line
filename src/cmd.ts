class cmd {
    cmder: string;
    cmdArgs: string;
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
    commandLine() {
        return this.cmder.concat(" ", this.cmdArgs);
    }
}

export class rg extends cmd {
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
        return super.appendArg(rg.lineMatchPattern);
    }
    setScope(scope: string | undefined) {
        return super.appendArg(scope);
    }
}


export class fzf extends cmd {
    static lineMatchPattern = "$";
    constructor() {
        super(`fzf`);
    }
    showLineNumber() {
        return super.appendArg("--line-number");
    }
    showColumn() {
        return super.appendArg("--column");
    }
    showColor() {
        return super.appendArg("--color");
    }
    fuzzyMatch(enabled: boolean) {
        return enabled ? super.appendArg("--enabled") : super.appendArg("--disabled");
    }
    setScope(scope: string | undefined) {
        return super.appendArg(scope);
    }
}