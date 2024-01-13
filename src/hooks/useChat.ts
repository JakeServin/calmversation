import { useState } from "react";
import moment from "moment";
import { CHAT_PROMPT } from "@/constants";

interface Message {
	name: string;
	avatarFallback: string;
	avatarImage?: string;
	content: string;
	time: string;
}

const useChat = () => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [responding, setResponding] = useState(false);

	const startConversation = async () => {
		setIsExpanded(!isExpanded); // Toggle the isExpanded state

		setResponding(true);
		const response = await fetch("/api/openai/get_response", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: [
					{
						role: "system",
						content: CHAT_PROMPT,
					},
					{
						role: "user",
						content: "Start a conversation",
					},
				],
			}),
		});
		const { textResponse } = await response.json();

		setResponding(false);
		setMessages([
			{
				name: "Aura",
				avatarFallback: "A",
				avatarImage:
					"https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv",
				content: textResponse.choices[0].message.content || "",
				time: moment().format("h:mm A"),
			},
		]);

		speak(textResponse.choices[0].message.content || "");
	};

	const handleSend = async () => {
		// Add message to chat log
		setMessages((prev) => [
			...prev,
			{
				name: "You",
				avatarFallback: "Y",
				content: input,
				time: moment().format("h:mm A"),
			},
		]);
		setInput("");
		setResponding(true);
		// Format messages for OpenAI
		const messagesCopy = [
			{
				role: "system",
				name: "system",
				content: CHAT_PROMPT,
			},
			{
				role: "user",
				name: "user",
				content: "Start a conversation",
			},
		];
		messages.forEach((message) => {
			messagesCopy.push({
				role: message.name === "Aura" ? "system" : "user",
				name: message.name,
				content: message.content || "",
			});
		});
		messagesCopy.push({
			role: "user",
			name: "user",
			content: input,
		});

		setResponding(true);
		const response = await fetch("/api/openai/get_response", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: messagesCopy,
			}),
		});
		const { textResponse } = await response.json();

		setResponding(false);
		// Add response to chat log
		setMessages((prev) => [
			...prev,
			{
				name: "Aura",
				avatarFallback: "A",
				avatarImage:
					"https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv",
				content: textResponse.choices[0].message.content || "",
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
	};

	return {
		isExpanded,
		input,
		setInput,
		messages,
		responding,
		startConversation,
		handleSend,
		speak,
	};
};

export default useChat;
