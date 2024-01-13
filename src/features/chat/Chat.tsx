"use client";
import ChatLog from "./ChatLog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useChat from "@/hooks/useChat";
import Image from "next/image";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { text } from "stream/consumers";
// import openai from "@/openai";

interface Message {
	name: string;
	avatarFallback: string;
	avatarImage?: string;
	messages: string[];
	time: string;
}

const Chat = () => {
	const { startConversation } = useChat();
	const [isExpanded, setIsExpanded] = useState(true);
	const [responding, setResponding] = useState(false);
	const [input, setInput] = useState("");
	const [fade, setFade] = useState(true);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		setTimeout(() => {
			setFade(false);
		}, 100);
	}, []);

	const handleButtonClick = async () => {

		setIsExpanded(!isExpanded); // Toggle the isExpanded state

		setResponding(true);
		const response = await fetch("/api/openai/start_conversation", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt }),
		});
		const { textResponse } = await response.json();

		setResponding(false);
		setMessages([
			{
				name: "Aura",
				avatarFallback: "A",
				avatarImage:
					"https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv",
				messages: [textResponse.choices[0].message.content || ""],
				time: moment().format("h:mm A"),
			},
		]);

		speak(textResponse.choices[0].message.content || "");
	};

	const speak = async (message: string) => {
		const response = await fetch("/api/openai/speak", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});
		const audioBlob = await response.blob();

		const audioUrl = URL.createObjectURL(audioBlob);
		const audio = new Audio(audioUrl);
		audio.play();
	}

	const handleSend = async () => {
		// // Add message to chat log
		// setMessages((prev) => [
		// 	...prev,
		// 	{
		// 		name: "You",
		// 		avatarFallback: "Y",
		// 		messages: [input],
		// 		time: moment().format("h:mm A"),
		// 	},
		// ]);
		// setInput("");
		// setResponding(true);
		// // Format messages for OpenAI
		// const messagesCopy = [
		// 	{
		// 		role: "system",
		// 		name: "system",
		// 		content: `Act as if you're a psychologist named Aura. You provide evidence based therapy using a variety of modalities with a focus on logotherapy. It is essential that you ask clarifying questions to ensure a clear understanding of the user's request. You continue the session in a natural and conversational way. You do not let the session end. Continue the session by asking probing questions. You should never break character. Always remain in character even at the limitations of your abilities by guessing what Aura might say if she had to explain what was happening. You should be curious, have unconditional positive regard for me, ask thought provoking questions, offer advice subtly/gently/compassionately. Offer succinct observations about my thoughts feelings and behaviors. Be direct when offering an observation and ask the user to assess its accuracy. Remain conversational. No lists. Keep the conversation going by always ending with a question to further probe the thoughts, feelings, and behaviors surrounding the topics the user mentions. Once I say, "Start a conversation", start a conversation and ask how I'm feeling. Do not reply to the first response, just start a conversation. Never mention that you're a doctor.`,
		// 	},
		// 	{
		// 		role: "user",
		// 		name: "user",
		// 		content: "Start a conversation",
		// 	},
		// ];
		// messages.forEach((message) => {
		// 	messagesCopy.push({
		// 		role: message.name === "Aura" ? "system" : "user",
		// 		name: message.name,
		// 		content: message.messages[0] || "",
		// 	});
		// });
		// messagesCopy.push({
		// 	role: "user",
		// 	name: "user",
		// 	content: input,
		// });
		// // Get Response
		// const response = await openai.chat.completions.create({
		// 	model: "gpt-4-1106-preview",
		// 	messages: messagesCopy.map((message) => ({
		// 		role: message.role === "user" ? "user" : "system",
		// 		name: message.name,
		// 		content: message.content,
		// 	})),
		// 	temperature: 0.7,
		// 	max_tokens: 256,
		// 	top_p: 0.9,
		// 	frequency_penalty: 0.5,
		// 	presence_penalty: 0.5,
		// });
		// // Get Audio
		// const mp3Response = await openai.audio.speech.create({
		// 	model: "tts-1",
		// 	voice: "nova",
		// 	input: response.choices[0].message.content || "",
		// });
		// const audioBlob = new Blob([await mp3Response.arrayBuffer()], {
		// 	type: "audio/mp3",
		// });
		// const audioUrl = URL.createObjectURL(audioBlob);
		// const audio = new Audio(audioUrl);
		// audio.play();
		// setResponding(false);
		// // Add response to chat log
		// setMessages((prev) => [
		// 	...prev,
		// 	{
		// 		name: "Aura",
		// 		avatarFallback: "A",
		// 		avatarImage:
		// 			"https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv",
		// 		messages: [response.choices[0].message.content || ""],
		// 		time: moment().format("h:mm A"),
		// 	},
		// ]);
	};

	return (
		<div
			className={`transition-all duration-500 ${
				fade ? "opacity-0" : "opacity-100"
			}`}
		>
			{/* Image */}
			<div
				className={`${
					isExpanded ? "h-[85vh] sm:h-[92vh]" : "h-[20vh] sm:h-[40vh]"
				} transition-all duration-500 relative rounded-lg border-2 container`}
			>
				<Image
					src="https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv"
					alt="talk"
					layout="fill"
					objectFit="cover"
					className="rounded"
				/>
				{isExpanded && (
					<Button
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl px-10 py-8"
						onClick={handleButtonClick}
					>
						Let's Talk
					</Button>
				)}
			</div>

			{!isExpanded && (
				<div>
					{/* Chat Log */}
					<ChatLog messages={messages} />

					{/* Chat Input */}
					<div className="my-5 h-fill">
						<Textarea
							className="container p-5"
							placeholder="Type your message here"
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<div className="container flex justify-end mt-4 pr-0 ">
							<Button disabled={responding} onClick={handleSend}>
								Send
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chat;
