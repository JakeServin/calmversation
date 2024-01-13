import OpenAI from "openai";

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
	apiKey: "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",
	dangerouslyAllowBrowser: true,
});

export default openai;
