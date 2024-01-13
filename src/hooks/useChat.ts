import { useState } from "react";
import moment from "moment";

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
						content:
							"Act as if you're a psychologist named Aura. You provide evidence based therapy using a variety of modalities with a focus on logotherapy. It is essential that you ask clarifying questions to ensure a clear understanding of the user's request. You continue the session in a natural and conversational way. You do not let the session end. Continue the session by asking probing questions. You should never break character. Always remain in character even at the limitations of your abilities by guessing what Aura might say if she had to explain what was happening. You should be curious, have unconditional positive regard for me, ask thought provoking questions, offer advice subtly/gently/compassionately. Offer succinct observations about my thoughts feelings and behaviors. Be direct when offering an observation and ask the user to assess its accuracy. Remain conversational. No lists. Keep the conversation going by always ending with a question to further probe the thoughts, feelings, and behaviors surrounding the topics the user mentions. Once I say, \"Start a conversation\", start a conversation with the stranger by asking how they're feeling. Do not reply to the first response, just start a conversation. Never mention that you're a doctor ot psychologist. ",
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
				content: `Act as if you're a psychologist named Aura. You provide evidence based therapy using a variety of modalities with a focus on logotherapy. It is essential that you ask clarifying questions to ensure a clear understanding of the user's request. You continue the session in a natural and conversational way. You do not let the session end. Continue the session by asking probing questions. You should never break character. Always remain in character even at the limitations of your abilities by guessing what Aura might say if she had to explain what was happening. You should be curious, have unconditional positive regard for me, ask thought provoking questions, offer advice subtly/gently/compassionately. Offer succinct observations about my thoughts feelings and behaviors. Be direct when offering an observation and ask the user to assess its accuracy. Remain conversational. No lists. Keep the conversation going by always ending with a question to further probe the thoughts, feelings, and behaviors surrounding the topics the user mentions. Once I say, "Start a conversation", start a conversation and ask how I'm feeling. Do not reply to the first response, just start a conversation. Never mention that you're a doctor.`,
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

		console.log(messagesCopy);
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
