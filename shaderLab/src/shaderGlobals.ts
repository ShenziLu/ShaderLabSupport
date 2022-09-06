export interface Tags {[name: string]: string[]}; 

export var tags: Tags = {
    Cull:[
        "Back","Front","Off"
    ],
    Zwrite:[
        "On","Off"
    ],
    ZTest:[
        "Less","Greater","LEqual","GEqual","Equal","NotEqual","ALways"
    ],
    ColorMask:[
        "RGB","A","R","G","B"
    ]
}

export var hlslIncludeFiles: Tags = {
    Package:[
        "com.unity.render-pipelines.universal",
        "com.unity.render-pipelines.core"
    ],
    "com.unity.render-pipelines.core":[
        "ShaderLibrary"
    ],
    "com.unity.render-pipelines.universal":[
        "ShaderLibrary",
        "Shaders"
    ]
}