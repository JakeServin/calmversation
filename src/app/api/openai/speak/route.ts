import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.NEXT_OPENAI_API_KEY,
});

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {

    const body = await req.json()
    const {message} = body

		const mp3Response = await openai.audio.speech.create({
			model: "tts-1",
			voice: "nova",
			input: message,
		});

		const audioBlob = new Blob([await mp3Response.arrayBuffer()], {
			type: "audio/mp3",
		});

		

    return new NextResponse(audioBlob, { headers: { "content-type": "audio/mp3" } });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to get admins" },
			{
				status: 500,
			}
		);
	}
}
