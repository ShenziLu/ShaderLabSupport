// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FileCompletionProvider from './FileCompletionProvider';
import ShaderHoverProvider from './HoverProvider';
import ShaderCompletionProvider from './ShaderCompletionProvider';
import ShaderCompletionWithSpaceProvider from './ShaderCompletionWithSpaceProvider';
import FileFirstCompletionProvider from "./FileFirstCompletionProvider"
import ShaderDocumentSymbolProvider from './SymbolProvider';
import ShaderDefinitionProvider from './DefinitionProvider';

const documentSelector = [
    { language: 'shader', scheme: 'file' },
    { language: 'shader', scheme: 'untitled' },
];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector,new ShaderCompletionProvider(),""));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector,new ShaderCompletionWithSpaceProvider()," "));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector,new FileCompletionProvider(),"/"));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector,new FileFirstCompletionProvider(),"\""));
    context.subscriptions.push(vscode.languages.registerHoverProvider(documentSelector,new ShaderHoverProvider()));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(documentSelector,new ShaderDocumentSymbolProvider()));
    let definitionProvider = new ShaderDefinitionProvider();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(documentSelector, definitionProvider));
    context.subscriptions.push(vscode.languages.registerImplementationProvider(documentSelector, definitionProvider));
    context.subscriptions.push(vscode.languages.registerTypeDefinitionProvider(documentSelector, definitionProvider));
}

// this method is called when your extension is deactivated
export function deactivate() {}
