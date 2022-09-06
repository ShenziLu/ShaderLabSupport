"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const FileCompletionProvider_1 = require("./FileCompletionProvider");
const HoverProvider_1 = require("./HoverProvider");
const ShaderCompletionProvider_1 = require("./ShaderCompletionProvider");
const ShaderCompletionWithSpaceProvider_1 = require("./ShaderCompletionWithSpaceProvider");
const FileFirstCompletionProvider_1 = require("./FileFirstCompletionProvider");
const SymbolProvider_1 = require("./SymbolProvider");
const DefinitionProvider_1 = require("./DefinitionProvider");
const documentSelector = [
    { language: 'shader', scheme: 'file' },
    { language: 'shader', scheme: 'untitled' },
];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
async function activate(context) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector, new ShaderCompletionProvider_1.default(), ""));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector, new ShaderCompletionWithSpaceProvider_1.default(), " "));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector, new FileCompletionProvider_1.default(), "/"));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector, new FileFirstCompletionProvider_1.default(), "\""));
    context.subscriptions.push(vscode.languages.registerHoverProvider(documentSelector, new HoverProvider_1.default()));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(documentSelector, new SymbolProvider_1.default()));
    let definitionProvider = new DefinitionProvider_1.default();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(documentSelector, definitionProvider));
    context.subscriptions.push(vscode.languages.registerImplementationProvider(documentSelector, definitionProvider));
    context.subscriptions.push(vscode.languages.registerTypeDefinitionProvider(documentSelector, definitionProvider));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map