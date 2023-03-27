const openai = require('@openai/api');
const api_key = process.env.OPENAI_API_KEY;

const openai_api = new openai(api_key);

openai_api.completions.create({
   engine: 'davinci',
   prompt: 'Hello, my name is',
   max_tokens: 5,
}).then(response => {
   console.log(response.data.choices[0].text);
}).catch(error => {
   console.log(error);
});
