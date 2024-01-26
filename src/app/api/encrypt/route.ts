import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
	try {
		const body = await req.json();

		const { plaintext } = body;
    const { ciphertext, iv } = await encryptMessage(plaintext);
    
    return NextResponse.json(
		{ ciphertext, iv },
		{
			status: 200,
		}
	);
	} catch (error) {
		return NextResponse.json(
			{ error: "Encryption Failed" },
			{
				status: 500,
			}
		);
	}
}

export default async function handler(
	req: NextRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
    try {
      const body = await req.json();

			const { plaintext } = body;
			const { ciphertext, iv } = await encryptMessage(plaintext);
			res.status(200).json({ ciphertext, iv });
		} catch (error) {
			res.status(500).json({ error: "Encryption failed" });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

async function encryptMessage(
	plaintext: string,
): Promise<{ ciphertext: string; iv: string }> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encoded = new TextEncoder().encode(plaintext);
	const keyBuffer = Uint8Array.from(atob(process.env.NEXT_CHAT_ENCRYPTION_KEY ?? ''), (c) => c.charCodeAt(0));

	const rawKey = await crypto.subtle.importKey(
		"raw",
		keyBuffer,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt"]
	);

	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		rawKey,
		encoded
	);

	return {
		ciphertext: btoa(
			String.fromCharCode(...Array.from(new Uint8Array(encrypted)))
		),
		iv: btoa(String.fromCharCode(...Array.from(iv))),
	};
}