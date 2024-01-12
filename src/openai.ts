import OpenAI from "openai";

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
	apiKey: "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",
	dangerouslyAllowBrowser: true,
});

export default openai;
