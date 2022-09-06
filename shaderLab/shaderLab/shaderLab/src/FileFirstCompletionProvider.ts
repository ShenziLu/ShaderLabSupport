import { CancellationToken, CompletionContext, CompletionItem, CompletionItemProvider, CompletionItemKind, Position, ProviderResult, TextDocument, Range } from "vscode";

export default class FileFirstCompletionProvider implements CompletionItemProvider{

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): Promise<CompletionItem[]> {
        let result: CompletionItem[] = [];
        let text = document.getText();
       
        let hlsl: string[] = ["Package"];
        let cg: string[] = ["AutoLight.cginc", "EditorUIE.cginc", "GraniteShaderLib3.cginc", "HLSLSupport.cginc", "Lighting.cginc", "SpeedTree8Common.cginc", "SpeedTreeBillboardCommon.cginc", "SpeedTreeCommon.cginc", "SpeedTreeVertex.cginc", "SpeedTreeWind.cginc", "TerrainEngine.cginc", "TerrainPreview.cginc", "TerrainSplatmapCommon.cginc", "TerrainTool.cginc", "Tessellation.cginc", "TextCoreProperties.cginc", "UnityBuiltin2xTreeLibrary.cginc", "UnityBuiltin3xTreeLibrary.cginc", "UnityCG.cginc", "UnityCustomRenderTexture.cginc", "UnityDeferredLibrary.cginc", "UnityDeprecated.cginc", "UnityGBuffer.cginc", "UnityGlobalIllumination.cginc", "UnityImageBasedLighting.cginc", "UnityInstancing.cginc", "UnityLegacyTextureStack.cginc", "UnityLightingCommon.cginc", "UnityMetaPass.cginc", "UnityPBSLighting.cginc", "UnityRayTracingMeshUtils.cginc", "UnityShaderUtilities.cginc", "UnityShaderVariables.cginc", "UnityShadowLibrary.cginc", "UnitySprites.cginc", "UnityStandardBRDF.cginc", "UnityStandardConfig.cginc", "UnityStandardCore.cginc", "UnityStandardCoreForward.cginc", "UnityStandardCoreForwardSimple.cginc", "UnityStandardInput.cginc", "UnityStandardMeta.cginc", "UnityStandardParticleEditor.cginc", "UnityStandardParticleInstancing.cginc", "UnityStandardParticles.cginc", "UnityStandardParticleShadow.cginc", "UnityStandardShadow.cginc", "UnityStandardUtils.cginc", "UnityUI.cginc", "UnityUIE.cginc"]

        var range = new Range(new Position(position.line,0),position);
        var prefix = document.getText(range);
        const pattern = /^\s*(#include)\s*\"/mg;
        var match = pattern.exec(prefix);
        if(match !== null)
        {
            if(text.includes("HLSLINCLUDE") || text.includes("HLSLPROGRAM"))   
            {
                for (let i = 0; i < hlsl.length; i++) {
                    result.push(new CompletionItem(hlsl[i],CompletionItemKind.File));
                }
            }
           
            if(text.includes("CGINCLUDE") || text.includes("CGPROGRAM"))
            {
                for (let i = 0; i < cg.length; i++) {
                    result.push(new CompletionItem(cg[i],CompletionItemKind.File));
                }
            }
        }
        
        
        return Promise.resolve(result);
    }
}