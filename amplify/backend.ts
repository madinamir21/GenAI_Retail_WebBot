import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({ 
  auth, 
  data,
});
const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource( 
  "bedrockDS", 
  "https://bedrock-runtime.us-east-1.amazonaws.com", 
  { 
    authorizationConfig: { 
      signingRegion: "us-east-1", 
      signingServiceName: "bedrock", 
    }, 
  }
);
bedrockDataSource.grantPrincipal.addToPrincipalPolicy( 
  new PolicyStatement({ 
    resources: [ 
      "arn:aws:bedrock:us-east-1::foundation-model/openai.gpt-oss-20b-1:0"
    ], 
    actions: ["bedrock:InvokeModel"], 
     
  })
);