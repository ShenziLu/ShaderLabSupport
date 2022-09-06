'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const hlslGlobals = require("./hlslGlobals");
class ShaderCompletionProvider {
    constructor() {
        this.triggerCharacters = [''];
    }
    provideCompletionItems(document, position, token) {
        let result = [];
        let docuText = document.getText();
        var range = document.getWordRangeAtPosition(position);
        var prefix = document.getText(range);
        var prefix = range ? document.getText(range) : '';
        if (!range) {
            range = new vscode_1.Range(position, position);
        }
        var added = {};
        var createNewProposal = function (kind, name, entry, type) {
            var proposal = new vscode_1.CompletionItem(name);
            proposal.kind = kind;
            if (entry) {
                if (entry.description) {
                    proposal.documentation = entry.description;
                }
                if (entry.parameters) {
                    let signature = type ? '(' + type + ') ' : '';
                    signature += name;
                    signature += '(';
                    if (entry.parameters && entry.parameters.length != 0) {
                        let params = '';
                        entry.parameters.forEach(p => params += p.label + ',');
                        signature += params.slice(0, -1);
                    }
                    signature += ')';
                    proposal.detail = signature;
                }
            }
            return proposal;
        };
        var matches = (name) => {
            return prefix.length === 0 || name.length >= prefix.length && name.substr(0, prefix.length) === prefix;
        };
        for (var name in hlslGlobals.datatypes) {
            if (hlslGlobals.datatypes.hasOwnProperty(name) && matches(name)) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.TypeParameter, name, hlslGlobals.datatypes[name], 'datatype'));
            }
        }
        for (var name in hlslGlobals.intrinsicfunctions) {
            if (hlslGlobals.intrinsicfunctions.hasOwnProperty(name) && matches(name)) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Function, name, hlslGlobals.intrinsicfunctions[name], 'function'));
            }
        }
        for (var name in hlslGlobals.shaderConstant) {
            if (hlslGlobals.shaderConstant.hasOwnProperty(name) && matches(name)) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Variable, name, hlslGlobals.shaderConstant[name], 'function'));
            }
        }
        for (var name in hlslGlobals.cgfunction) {
            if (hlslGlobals.cgfunction.hasOwnProperty(name) && matches(name) && docuText.includes("CG")) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Function, name, hlslGlobals.cgfunction[name], 'function'));
            }
        }
        for (var name in hlslGlobals.hlslfunction) {
            if (hlslGlobals.hlslfunction.hasOwnProperty(name) && matches(name) && docuText.includes("HLSL")) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Function, name, hlslGlobals.hlslfunction[name], 'function'));
            }
        }
        for (var name in hlslGlobals.semantics) {
            if (hlslGlobals.semantics.hasOwnProperty(name) && matches(name)) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Reference, name, hlslGlobals.semantics[name], 'semantic'));
            }
        }
        for (var name in hlslGlobals.semanticsNum) {
            if (hlslGlobals.semanticsNum.hasOwnProperty(name) && matches(name)) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Reference, name, hlslGlobals.semanticsNum[name], 'semantic'));
            }
        }
        for (var name in hlslGlobals.keywords) {
            if (hlslGlobals.keywords.hasOwnProperty(name) && matches(name)) {
                added[name] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Keyword, name, hlslGlobals.keywords[name], 'keyword'));
            }
        }
        var text = document.getText();
        var functionMatch = /\w+\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)\s*\(/mg;
        var variable = /\s+((sampler)?_+[a-zA-Z0-9][_A-Za-z0-9]*)/mg;
        var match = null;
        while (match = variable.exec(text)) {
            var word = match[1];
            if (!added[word]) {
                added[word] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Property, word, null));
            }
        }
        while (match = functionMatch.exec(text)) {
            var word = match[1];
            if (!added[word]) {
                added[word] = true;
                result.push(createNewProposal(vscode_1.CompletionItemKind.Function, word, null));
            }
        }
        var com = new vscode_1.CompletionItem("Blend");
        com.insertText = new vscode_1.SnippetString("Blend ${1|Zero,One,SrcColor,DstColor,SrcAlpha,DstAlpha,OneMinusSrcColor,OneMinusDstColor,OneMinusSrcAlpha,OneMinusDstAlpha|} ${2|Zero,One,SrcColor,DstColor,SrcAlpha,DstAlpha,OneMinusSrcColor,OneMinusDstColor,OneMinusSrcAlpha,OneMinusDstAlpha|}");
        result.push(com);
        return Promise.resolve(result);
    }
}
exports.default = ShaderCompletionProvider;
//# sourceMappingURL=ShaderCompletionProvider.js.map