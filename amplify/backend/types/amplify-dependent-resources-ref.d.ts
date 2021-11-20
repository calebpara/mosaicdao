export type AmplifyDependentResourcesAttributes = {
    "function": {
        "daorpc": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "imgrpc": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "daorpc": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "imgrpc": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}