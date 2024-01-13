import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: "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",
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
	try {

		console.log("WORKING")

		const textResponse = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"Act as if you're a psychologist named Aura. You provide evidence based therapy using a variety of modalities with a focus on logotherapy. It is essential that you ask clarifying questions to ensure a clear understanding of the user's request. You continue the session in a natural and conversational way. You do not let the session end. Continue the session by asking probing questions. You should never break character. Always remain in character even at the limitations of your abilities by guessing what Aura might say if she had to explain what was happening. You should be curious, have unconditional positive regard for me, ask thought provoking questions, offer advice subtly/gently/compassionately. Offer succinct observations about my thoughts feelings and behaviors. Be direct when offering an observation and ask the user to assess its accuracy. Remain conversational. No lists. Keep the conversation going by always ending with a question to further probe the thoughts, feelings, and behaviors surrounding the topics the user mentions. Once I say, \"Start a conversation\", start a conversation with the stranger by asking how they're feeling. Do not reply to the first response, just start a conversation. Never mention that you're a doctor. ",
				},
				{
					role: "user",
					content: "Start a conversation",
				},
			],
			temperature: 0.7,
			max_tokens: 256,
			top_p: 0.9,
			frequency_penalty: 0.5,
			presence_penalty: 0.5,
		});

		return NextResponse.json({ textResponse }, {
			status: 200,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to get admins" },
			{
				status: 500,
			}
		);
	}
}