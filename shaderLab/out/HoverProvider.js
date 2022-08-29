"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToMarkedString = void 0;
const vscode_1 = require("vscode");
const hlslGlobals = require("./hlslGlobals");
function textToMarkedString(text) {
    return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
}
exports.textToMarkedString = textToMarkedString;
class ShaderHoverProvider {
    getSymbols(document) {
        return vscode_1.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
    }
    async provideHover(document, position, token) {
        let wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return undefined;
        }
        let name = document.getText(wordRange);
        let backchar = '';
        if (wordRange.start.character > 0) {
            let backidx = wordRange.start.translate({ characterDelta: -1 });
            backchar = backidx.character < 0 ? '' : document.getText(new vscode_1.Range(backidx, wordRange.start));
        }
        if (backchar === '#') {
            const key = name.substr(1);
            var entry = hlslGlobals.preprocessors[name.toUpperCase()];
            if (entry && entry.description) {
                let signature = '(*preprocessor*) ';
                signature += '**#' + name + '**';
                let contents = [];
                contents.push(new vscode_1.MarkdownString(signature));
                contents.push(textToMarkedString(entry.description));
                return new vscode_1.Hover(contents, wordRange);
            }
        }
        var entry = hlslGlobals.intrinsicfunctions[name];
        if (entry && entry.description) {
            let signature = '(*function*) ';
            signature += '**' + name + '**';
            signature += '(';
            if (entry.parameters && entry.parameters.length != 0) {
                let params = '';
                entry.parameters.forEach(p => params += p.label + ',');
                signature += params.slice(0, -1);
            }
            signature += ')';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            contents.push(textToMarkedString(entry.description));
            return new vscode_1.Hover(contents, wordRange);
        }
        entry = hlslGlobals.datatypes[name];
        if (entry && entry.description) {
            let signature = '(*datatype*) ';
            signature += '**' + name + '**';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            contents.push(textToMarkedString(entry.description));
            return new vscode_1.Hover(contents, wordRange);
        }
        entry = hlslGlobals.cgfunction[name];
        if (entry && entry.description) {
            let signature = '(*cgfunction*) ';
            signature += '**' + name + '**';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            contents.push({ language: "shader", value: entry.description });
            return new vscode_1.Hover(contents, wordRange);
        }
        entry = hlslGlobals.hlslfunction[name];
        if (entry && entry.description) {
            let signature = '(*hlslfunction*) ';
            signature += '**' + name + '**';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            contents.push({ language: "shader", value: entry.description });
            return new vscode_1.Hover(contents, wordRange);
        }
        entry = hlslGlobals.shaderConstant[name];
        if (entry && entry.description) {
            let signature = '(*shaderConstant*) ';
            signature += '**' + name + '**';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            contents.push({ language: "shader", value: entry.description });
            return new vscode_1.Hover(contents, wordRange);
        }
        entry = hlslGlobals.semantics[name.toUpperCase()];
        if (entry && entry.description) {
            let signature = '(*semantic*) ';
            signature += '**' + name + '**';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            contents.push(textToMarkedString(entry.description));
            return new vscode_1.Hover(contents, wordRange);
        }
        let key = name.replace(/\d+$/, ''); //strip tailing number
        entry = hlslGlobals.semanticsNum[key.toUpperCase()];
        if (entry && entry.description) {
            let signature = '(*semantic*) ';
            signature += '**' + name + '**';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            contents.push(textToMarkedString(entry.description));
            return new vscode_1.Hover(contents, wordRange);
        }
        entry = hlslGlobals.keywords[name];
        if (entry) {
            let signature = '(*keyword*) ';
            signature += '**' + name + '**';
            let contents = [];
            contents.push(new vscode_1.MarkdownString(signature));
            return new vscode_1.Hover(contents, wordRange);
        }
        let symbols = await this.getSymbols(document);
        for (let s of symbols) {
            if (s.name === name) {
                let contents = [];
                let signature = '(*' + vscode_1.SymbolKind[s.kind].toLowerCase() + '*) ';
                signature += s.containerName ? s.containerName + '.' : '';
                signature += '**' + name + '**';
                contents.push(new vscode_1.MarkdownString(signature));
                if (s.location.uri.toString() === document.uri.toString()) {
                    //contents = [];
                    contents.push({ language: 'shader', value: document.getText(s.location.range) });
                }
                return new vscode_1.Hover(contents, wordRange);
            }
        }
    }
}
exports.default = ShaderHoverProvider;
//# sourceMappingURL=HoverProvider.js.map