import *  as utils from "./utils";

class Command {
    cmdline: string[];
    constructor(cmd: string) {
        this.cmdline = [];
        this.cmdline.push(cmd);
    }
    appendArg(param: string | undefined) {
        if (param !== undefined) {
            this.cmdline.push(param);
        }
        return this;
    }
    build() {
        return this.cmdline.join(' ');
    }
}

export class RG extends Command {
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

export class FzF extends Command {
    static lineMatchPattern = "$";
    static defaultColorOption = "hl:-1:underline,hl+:-1:underline:reverse";
    constructor() {
        super(`fzf`);
    }
    parseANSI() {
        return super.appendArg("--ansi");
    }
    showColor(option: string) {
        return super.appendArg(`--color "${option}"`);
    }
    delimiter(pattern: string) {
        // Field delimiter regex (default: AWK-style)
        return super.appendArg(`--delimiter ${pattern}`);
    }
    preview() {
        // require bat install
        super.appendArg(`--preview "bat --color=always ${utils.getActiveEditorRelativePath()}  --highlight-line {1}"`);
        super.appendArg(`--preview-window "right,50%,,+{1}+3/3,~3"`);
        return this;
    }
    reverse() {
        return super.appendArg(`--reverse`);
    }
    fuzzyMatch(enabled: boolean) {
        return enabled ? super.appendArg("--enabled") : super.appendArg("--disabled");
    }
}

export class CommandLineBuilder {
    private commands: string[] = [];
    private extraInfo?: string;
    public command(cmd: Command): this {
        this.commands.push(cmd.build());
        return this;
    }

    public pipe(): this {
        // 确保不是第一个命令前添加管道符号  
        if (this.commands.length > 0) {
            this.commands.push('|');
        }
        return this;
    }

    public redirect(output: string): this {
        // 确保不是第一个命令前添加重定向符号  
        if (this.commands.length > 0) {
            this.commands.push('>');
        }
        this.commands.push(output);
        return this;
    }

    public extra(info: string | undefined): this {
        this.extraInfo = info;
        return this;
    }

    public build(): string {
        return this.commands.join(' ');
    }
}  