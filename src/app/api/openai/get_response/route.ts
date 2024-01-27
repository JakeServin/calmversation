import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CHAT_CONFIG } from "@/common/constants";

const openai = new OpenAI({
	apiKey: process.env.NEXT_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { messages } = body;

		const textResponse = await openai.chat.completions.create({
			...CHAT_CONFIG,
			messages,
		});

		return NextResponse.json(
			{ textResponse },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to get admins" },
			{
				status: 500,
			}
		);
	}
}
