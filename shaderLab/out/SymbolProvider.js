'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const searchPatterns = [
    { kind: vscode_1.SymbolKind.Function, pattern: /\s[a-zA-Z0-9]+\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)\s*\(/.source },
    { kind: vscode_1.SymbolKind.Struct, pattern: /(?:struct|cbuffer|tbuffer)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/.source },
    { kind: vscode_1.SymbolKind.Variable, pattern: /^(?:sampler|sampler1D|sampler2D|sampler3D|samplerCUBE|samplerRECT|sampler_state|SamplerState)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/.source },
    { kind: vscode_1.SymbolKind.Field, pattern: /^(?:texture|texture2D|textureCUBE|Texture1D|Texture1DArray|Texture2D|Texture2DArray|Texture2DMS|Texture2DMSArray|Texture3D|TextureCube|TextureCubeArray|RWTexture1D|RWTexture1DArray|RWTexture2D|RWTexture2DArray|RWTexture3D)(?:\s*<(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9,_\x7f-\xff]*)>)?\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9\[\]_\x7f-\xff]*)/.source },
    { kind: vscode_1.SymbolKind.Field, pattern: /^(?:AppendStructuredBuffer|Buffer|ByteAddressBuffer|ConsumeStructuredBuffer|RWBuffer|RWByteAddressBuffer|RWStructuredBuffer|StructuredBuffer)(?:\s*<(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9,_\x7f-\xff]*)>)?\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9\[\]_\x7f-\xff]*)/.source },
];
const searchPatternsA = [
    { kind: vscode_1.SymbolKind.Property, pattern: /\s+((sampler)?_+[a-zA-Z0-9][_A-Za-z0-9]*)\s*\(/.source, patternA: /((sampler)?_+[a-zA-Z0-9][_A-Za-z0-9]*)\s*\(/.source },
];
class ShaderDocumentSymbolProvider {
    getDocumentSymbols(uri) {
        return new Promise((resolve, reject) => {
            let result = [];
            let add = {};
            let document = null;
            for (let d of vscode_1.workspace.textDocuments) {
                if (d.uri.toString() === uri.toString()) {
                    document = d;
                    break;
                }
            }
            if (document === null) {
                resolve([]);
                return;
            }
            let text = document.getText();
            function fetchSymbol(entry) {
                const kind = entry.kind;
                const pattern = entry.pattern;
                let regex = new RegExp(pattern, "gm");
                let match = null;
                while ((match = regex.exec(text)) && document) {
                    let line = document.positionAt(match.index).line;
                    let range = document.lineAt(line).range;
                    let word = match[1];
                    let lastChar = kind === vscode_1.SymbolKind.Function ? ')' :
                        kind === vscode_1.SymbolKind.Struct ? '}' :
                            kind === vscode_1.SymbolKind.Variable ? ';' :
                                kind === vscode_1.SymbolKind.Field ? ';' :
                                    kind === vscode_1.SymbolKind.Property ? '\t' :
                                        '';
                    if (lastChar) {
                        let end = text.indexOf(lastChar, match.index);
                        range = new vscode_1.Range(range.start, document.positionAt(end));
                    }
                    if (add[word]) {
                        continue;
                    }
                    add[word] = true;
                    result.push(new vscode_1.SymbolInformation(word, kind, '', new vscode_1.Location(document.uri, range)));
                }
            }
            function fetchSymbolA(entry) {
                const kind = entry.kind;
                const pattern = entry.pattern;
                let regex = new RegExp(pattern, "gm");
                let match = null;
                while ((match = regex.exec(text)) && document) {
                    let index = match.index;
                    match = new RegExp(entry.patternA, "gm").exec(match[0]);
                    if (match === null) {
                        continue;
                    }
                    let line = document.positionAt(match.index + index).line;
                    let range = document.lineAt(line).range;
                    let word = match[1];
                    if (match[1] === "defined" || range === undefined) {
                        continue;
                    }
                    let lastChar = kind === vscode_1.SymbolKind.Property ? '\t' :
                        '';
                    if (lastChar) {
                        let end = text.indexOf(lastChar, match.index + index);
                        range = new vscode_1.Range(range.start, document.positionAt(end));
                    }
                    if (add[word]) {
                        continue;
                    }
                    add[word] = true;
                    result.push(new vscode_1.SymbolInformation(word, kind, '', new vscode_1.Location(document.uri, range)));
                }
            }
            for (let entry of searchPatternsA) {
                fetchSymbolA(entry);
            }
            for (let entry of searchPatterns) {
                fetchSymbol(entry);
            }
            resolve(result);
        });
    }
    provideDocumentSymbols(document, token) {
        return this.getDocumentSymbols(document.uri);
    }
}
exports.default = ShaderDocumentSymbolProvider;
//# sourceMappingURL=SymbolProvider.js.map