"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hlslIncludeFiles = exports.tags = void 0;
;
exports.tags = {
    Cull: [
        "Back", "Front", "Off"
    ],
    Zwrite: [
        "On", "Off"
    ],
    ZTest: [
        "Less", "Greater", "LEqual", "GEqual", "Equal", "NotEqual", "ALways"
    ],
    ColorMask: [
        "RGB", "A", "R", "G", "B"
    ]
};
exports.hlslIncludeFiles = {
    Package: [
        "com.unity.render-pipelines.universal",
        "com.unity.render-pipelines.core"
    ],
    "com.unity.render-pipelines.core": [
        "ShaderLibrary"
    ],
    "com.unity.render-pipelines.universal": [
        "ShaderLibrary",
        "Shaders"
    ]
};
//# sourceMappingURL=shaderGlobals.js.map