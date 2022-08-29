'use strict';

import { DocumentSymbolProvider, WorkspaceSymbolProvider, SymbolKind, SymbolInformation, CancellationToken, TextDocument, Position, Range, RelativePattern, Location, Uri, Disposable, window, workspace, extensions, TextDocumentChangeReason } from 'vscode';


interface ISymbolPattern { kind: SymbolKind, pattern: string}

const searchPatterns: ISymbolPattern[] = [
    { kind: SymbolKind.Function, pattern: /\s[a-zA-Z0-9]+\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)\s*\(/.source },
    { kind: SymbolKind.Struct, pattern: /(?:struct|cbuffer|tbuffer)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/.source },
    { kind: SymbolKind.Variable, pattern: /^(?:sampler|sampler1D|sampler2D|sampler3D|samplerCUBE|samplerRECT|sampler_state|SamplerState)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/.source },
    { kind: SymbolKind.Field, pattern: /^(?:texture|texture2D|textureCUBE|Texture1D|Texture1DArray|Texture2D|Texture2DArray|Texture2DMS|Texture2DMSArray|Texture3D|TextureCube|TextureCubeArray|RWTexture1D|RWTexture1DArray|RWTexture2D|RWTexture2DArray|RWTexture3D)(?:\s*<(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9,_\x7f-\xff]*)>)?\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9\[\]_\x7f-\xff]*)/.source },
    { kind: SymbolKind.Field, pattern: /^(?:AppendStructuredBuffer|Buffer|ByteAddressBuffer|ConsumeStructuredBuffer|RWBuffer|RWByteAddressBuffer|RWStructuredBuffer|StructuredBuffer)(?:\s*<(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9,_\x7f-\xff]*)>)?\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9\[\]_\x7f-\xff]*)/.source },
];

interface ISymbolPatternA { kind: SymbolKind, pattern: string, patternA: string}

const searchPatternsA: ISymbolPatternA[] = [
    { kind: SymbolKind.Property, pattern: /\s+((sampler)?_+[a-zA-Z0-9][_A-Za-z0-9]*)\s*\(/.source, patternA: /((sampler)?_+[a-zA-Z0-9][_A-Za-z0-9]*)\s*\(/.source},
]

export interface ISymbolCache { [path: string]: SymbolInformation[]; }

export default class ShaderDocumentSymbolProvider implements DocumentSymbolProvider{

    private getDocumentSymbols(uri: Uri): Promise<SymbolInformation[]> {
        return new Promise<SymbolInformation[]>((resolve, reject) => {
            let result: SymbolInformation[] = [];
            let add: any = {};

            let document: TextDocument|null = null;
            for (let d of workspace.textDocuments) {
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
            function fetchSymbol(entry: ISymbolPattern) {
                const kind = entry.kind;
                const pattern = entry.pattern;

                let regex = new RegExp(pattern, "gm");
                let match: RegExpExecArray|null = null;
                while ((match = regex.exec(text))&&document) {
                    let line = document.positionAt(match.index).line;
                    let range = document.lineAt(line).range;
                    let word = match[1];
                    
                    let lastChar =  kind === SymbolKind.Function ? ')' :
                                    kind === SymbolKind.Struct ? '}' :
                                    kind === SymbolKind.Variable ? ';' :
                                    kind === SymbolKind.Field ? ';' :
                                    kind === SymbolKind.Property ? '\t':
                                    '';

                    if (lastChar) {
                        let end = text.indexOf(lastChar, match.index);
                        range = new Range(range.start, document.positionAt(end));
                    }
                    if(add[word])
                    {
                        continue;
                    }
                    add[word] = true;
                    result.push(new SymbolInformation(word, kind, '', new Location(document.uri, range)));
                }
            }
            function fetchSymbolA(entry: ISymbolPatternA) {
                const kind = entry.kind;
                const pattern = entry.pattern;

                let regex = new RegExp(pattern, "gm");
                let match: RegExpExecArray|null = null;
                while ((match = regex.exec(text))&&document) {
                    let index = match.index;
                    match = new RegExp(entry.patternA, "gm").exec(match[0]);
                    
                    if(match === null)
                    {
                        continue;
                    }

                    let line = document.positionAt(match.index+index).line;
                    let range = document.lineAt(line).range;
                    let word = match[1];
                    
                    if(match[1] === "defined" || range === undefined)
                    {
                        continue;
                    }

                    let lastChar =  kind === SymbolKind.Property ? '\t':
                                    '';

                    if (lastChar) {
                        let end = text.indexOf(lastChar, match.index+index);
                        range = new Range(range.start, document.positionAt(end));
                    }
                    
                    if(add[word])
                    {
                        continue;
                    }
                    add[word] = true;
                    result.push(new SymbolInformation(word, kind, '', new Location(document.uri, range)));
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

    public provideDocumentSymbols(document: TextDocument, token: CancellationToken): Thenable<SymbolInformation[]> {
        return this.getDocumentSymbols(document.uri);
    }

}
