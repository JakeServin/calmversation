import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { ciphertext, iv } = await body;
		const plaintext = await decryptMessage(ciphertext, iv);

		return NextResponse.json(
			{ plaintext },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Decryption failed" },
			{
				status: 500,
			}
		);
	}
}

async function decryptMessage(
	encryptedData: string,
	base64Iv: string
): Promise<string> {
	const iv = Uint8Array.from(atob(base64Iv), (c) => c.charCodeAt(0));
	const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) =>
		c.charCodeAt(0)
	);
	const keyBuffer = Uint8Array.from(
		atob(process.env.NEXT_PUBLIC_CHAT_ENCRYPTION_KEY ?? ""),
		(c) => c.charCodeAt(0)
	);

	const rawKey = await crypto.subtle.importKey(
		"raw",
		keyBuffer,
		{ name: "AES-GCM", length: 256 },
		false,
		["decrypt"]
	);

	const decrypted = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv },
		rawKey,
		encryptedBuffer
	);

	return new TextDecoder().decode(decrypted);
}
