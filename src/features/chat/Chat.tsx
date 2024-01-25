"use client";
import ChatLog from "./ChatLog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { CHAT_PROMPT } from "@/common/constants";
import moment from "moment";
import { openSans } from "@/common/fonts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Chat = () => {
	const [fade, setFade] = useState(true);
	const { messages, setMessages, user } = useStore();
	const [isExpanded, setIsExpanded] = useState(true);
	const [input, setInput] = useState("");
	const [responding, setResponding] = useState(false);
	const [active, setActive] = useState(false);
	const supabase = createClientComponentClient();

	useEffect(() => {
		if (messages.length > 0) setIsExpanded(false);

		if (user) syncMessages();
	}, [user, messages]);

	const startConversation = async () => {
		setIsExpanded(!isExpanded); // Toggle the isExpanded state

		// If there are already messages, don't start a new conversation
		if (messages.length > 0) {
			return;
		}

		// Start a new conversation
		setResponding(true);
		setActive(true);
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

		setMessages([
			{
				name: "Aura",
				sentByAura: true,
				content: textResponse.choices[0].message.content || "",
				time: moment().format("h:mm A"),
			},
		]);
		setResponding(false);

		speak(textResponse.choices[0].message.content || "");
	};

	const handleSend = async () => {
		setActive(true);

		// Add message to chat log
		setMessages((prev) => [
			...prev,
			{
				name: "You",
				sentByAura: false,
				content: input,
				time: moment().format("h:mm A"),
			},
		]);
		setInput("");
		alert("ADDED TO LOG");

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

		// Add response to chat log
		setMessages((prev) => [
			...prev,
			{
				name: "Aura",
				sentByAura: true,
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

		syncMessages();
	};

	const syncMessages = async () => {
		// Check for thread
		var threadId = "";
		const { data, error } = await supabase
			.from("threads")
			.select("*")
			.eq("userId", user?.id);
		if (!data?.length) {
			// Create thread
			const { data: thread, error: threadError } = await supabase
				.from("threads")
				.insert([
					{
						userId: user?.id,
					},
				])
				.select();

			if (threadError) {
				console.error(threadError);
				return;
			}

			threadId = thread[0].id;
		} else {
			threadId = data[0].id;
		}

		const unsycnedMessages = messages.filter((message) => !message.id);

		if (unsycnedMessages.length) {
			// Sync unsynced messages to database
			for (let message of unsycnedMessages) {
				const syncedMessage = {
					sentAt: moment(message.time, "h:mm A").format(),
					content: message.content,
					sentByAura: message.name === "Aura",
					threadId: threadId,
				};
				const { data: thread, error: threadError } = await supabase
					.from("messages")
					.insert([syncedMessage])
					.select();

				if (threadError) {
					console.error(threadError);
				}
			}

			// Get messages from database
			const { data: databaseMessages, error: messagesError } =
				await supabase
					.from("messages")
					.select("*")
					.eq("threadId", threadId);

			databaseMessages &&
				setMessages(
					databaseMessages.map((message) => ({
						id: message.id,
						name: message.sentByAura ? "Aura" : "You",
						content: message.content,
						sentByAura: message.sentByAura,
						time: moment(message.sentAt).format("h:mm A"),
					}))
				);
		} else if (!messages.length) {
			// Get messages from database
			const { data: databaseMessages, error: messagesError } =
				await supabase
					.from("messages")
					.select("*")
					.eq("threadId", threadId)
					.order("id");

			databaseMessages &&
				setMessages(
					databaseMessages.map((message) => ({
						id: message.id,
						name: message.sentByAura ? "Aura" : "You",
						content: message.content,
						sentByAura: message.sentByAura,
						time: moment(message.sentAt).format("h:mm A"),
					}))
				);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			setFade(false);
		}, 100);
	}, []);

	const handleButtonClick = async () => {
		startConversation();
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
				<Button
					className={`${
						!isExpanded ? "opacity-0" : "opacity-100"
					} transition-all duration-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl px-10 py-8 font-semibold`}
					onClick={handleButtonClick}
				>
					Let&apos;s Talk
				</Button>
			</div>

			{!isExpanded && (
				<div>
					{/* Chat Log */}
					<ChatLog messages={messages} active={active} />

					{/* Chat Input */}
					<div className={`my-5 h-fill ${openSans.className} px-4`}>
						<Textarea
							className={`container p-5 text-base`}
							placeholder="Type your message here"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault(); // Prevents the default action of entering a new line
									if (input) handleSend();
								}
							}}
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
