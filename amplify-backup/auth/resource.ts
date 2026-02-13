import { defineAuth } from "@aws-amplify/backend";
export const auth = defineAuth({ 
  loginWith: { 
    email: { 
      verificationEmailStyle: "CODE", 
      verificationEmailSubject: "Welcome to Super Awesome Shopper Helper!", 
      verificationEmailBody: (createCode) => 
        `Use this code to confirm your account: ${createCode()}`, 
    }, 
  },
});
