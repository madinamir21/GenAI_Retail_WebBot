/* backend */
export function request(ctx) {
    const { input } = ctx.args;
  
    return {
      resourcePath: `/model/openai.gpt-oss-20b-1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_tokens: 1000,
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: input
            }
          ]
        }),
      },
    };
  }

  export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);

  return {
    body: parsedBody.choices[0].message.content
  };
}