import { CancellationToken, CompletionContext, CompletionItem, CompletionItemProvider, CompletionItemKind, Position, ProviderResult, TextDocument } from "vscode";
import { tags, Tags } from "./shaderGlobals";

export default class ShaderCompletionWithSpaceProvider implements CompletionItemProvider{

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): Promise<CompletionItem[]> {
        let result: CompletionItem[] = [];

        let createNewCompletion = function (kind: CompletionItemKind,name: string,strs: string[]) {
            if(name)
            {
                let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (linePrefix.endsWith(name+" ")) {
					for(var str in strs){
                        result.push(new CompletionItem(strs[str],CompletionItemKind.Property));
                    }
				}
            }
        }; 

        for (var key in tags) {
            if (tags.hasOwnProperty(key)) {
                createNewCompletion(CompletionItemKind.Enum,key,tags[key]);
            }
        }
        return Promise.resolve(result);
    }
}