"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const shaderGlobals_1 = require("./shaderGlobals");
class FileCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        let result = [];
        let createNewCompletion = function (kind, name, strs) {
            if (name) {
                let linePrefix = document.lineAt(position).text.substr(0, position.character);
                if (linePrefix.endsWith("\"" + name + "/") || linePrefix.endsWith(name + "/")) {
                    for (var str in strs) {
                        result.push(new vscode_1.CompletionItem(strs[str], vscode_1.CompletionItemKind.Property));
                    }
                }
            }
        };
        for (var key in shaderGlobals_1.hlslIncludeFiles) {
            if (shaderGlobals_1.hlslIncludeFiles.hasOwnProperty(key)) {
                createNewCompletion(vscode_1.CompletionItemKind.Enum, key, shaderGlobals_1.hlslIncludeFiles[key]);
            }
        }
        return Promise.resolve(result);
    }
}
exports.default = FileCompletionProvider;
//# sourceMappingURL=FileCompletionProvider.js.map