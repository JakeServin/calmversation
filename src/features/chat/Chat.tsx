"use client";
import ChatLog from "./ChatLog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import { CHAT_PROMPT, VOICE_OPTIONS } from "@/common/constants";
import { openSans } from "@/common/fonts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	AlertDialogAction,
} from "@radix-ui/react-alert-dialog";
import { toast } from "@/components/ui/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const Chat = ({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const [fade, setFade] = useState(true);
	const { messages, setMessages, user, settings, setSettings } = useStore();
	const [isExpanded, setIsExpanded] = useState(true);
	const [input, setInput] = useState("");
	const [responding, setResponding] = useState(false);
	const [active, setActive] = useState(false);
	const supabase = createClientComponentClient();
	const [confirmEmailModal, setConfirmEmailModal] = useState(false);
	const [mute, setMute] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const error = messages[messages.length - 1]?.error;

	useEffect(() => {
		if (searchParams?.newUser === "true") {
			setConfirmEmailModal(true);
		}

		syncMessages();

		return () => {
			if (audioRef.current) {
				audioRef.current.pause(); // Ensure audio is stopped
				audioRef.current = null; // Clear the reference
			}
		};
	}, []);

	useEffect(() => {
		if (user?.id) syncMessages();
	}, [user?.id]);

	useEffect(() => {
		if (messages.length > 0) setIsExpanded(false);
		syncMessages();
	}, [messages]);

	useEffect(() => {
		setTimeout(() => {
			setFade(false);
		}, 100);
	}, []);

	const handleButtonClick = async () => {
		startConversation();
	};

	const handleSend = async () => {
		if (!input) return;

		setActive(true);
		setResponding(true);

		// Add message to chat log
		setMessages((prev) => [
			...prev,
			{
				name: "You",
				sentByAura: false,
				content: input,
				time: new Date(),
			},
		]);
		setInput("");

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
		// Add previous messages to messagesCopy
		messages.forEach((message) => {
			messagesCopy.push({
				role: message.name === "Aura" ? "system" : "user",
				name: message.name,
				content: message.content || "",
			});
		});
		// Add new message to messagesCopy
		messagesCopy.push({
			role: "user",
			name: "user",
			content: input,
		});

		getResponse(messagesCopy);
	};

	const resend = () => {
		getResponse(messages);
	};

	const getResponse = async (messages: any[]) => {
		try {
			const response = await fetch("/api/openai/get_response/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: messages,
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
					time: new Date(),
				},
			]);

			speak(
				textResponse.choices[0].message.content || "",
				settings.voice
			);
			setResponding(false);
			syncMessages();
		} catch {
			setResponding(false);

			setMessages((prev) => {
				const copy = [...prev];
				copy[copy.length - 1].error = true;

				return copy;
			});
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "Please try again.",
			});
		}
	};

	const speak = async (message: string, voice: string) => {
		if (mute) return;
		const response = await fetch("/api/openai/speak", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message,
				voice: voice,
			}),
		});
		const audioBlob = await response.blob();

		if (audioRef.current) {
			audioRef.current.pause(); // Pause current playing audio if any
			audioRef.current = null; // Reset the current audio
		}

		const audioUrl = URL.createObjectURL(audioBlob);
		audioRef.current = new Audio(audioUrl);
		audioRef.current.play();
	};

	const syncMessages = async () => {
		if (user?.id) {
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
					.insert([{ userId: user?.id }])
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
					// Encrypt message content

					// Encrypt message here
					const encryptedContent = await encryptMessage(
						message.content
					);

					const syncedMessage = {
						sentAt: message.time,
						content: encryptedContent.ciphertext,
						iv: encryptedContent.iv,
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
						.eq("threadId", threadId)
						.order("sentAt");

				if (databaseMessages) {
					const decryptedMessages = await Promise.all(
						databaseMessages.map(async (message) => {
							const decryptedContent = await decryptMessage(
								message.content,
								message.iv
							);
							return {
								...message,
								content: decryptedContent,
							};
						})
					);

					setMessages(
						decryptedMessages.map((message) => ({
							id: message.id,
							name: message.sentByAura ? "Aura" : "You",
							content: message.content,
							sentByAura: message.sentByAura,
							time: message.sentAt,
						}))
					);
				}
			} else if (!messages.length) {
				// Get messages from database
				const { data: databaseMessages, error: messagesError } =
					await supabase
						.from("messages")
						.select("*")
						.eq("threadId", threadId);
				// .order("id");

				if (databaseMessages?.length) {
					const decryptedMessages = await Promise.all(
						databaseMessages.map(async (message) => {
							const decryptedContent = await decryptMessage(
								message.content,
								message.iv
							);
							return {
								...message,
								content: decryptedContent,
							};
						})
					);

					setMessages(
						decryptedMessages.map((message) => ({
							id: message.id,
							name: message.sentByAura ? "Aura" : "You",
							content: message.content,
							sentByAura: message.sentByAura,
							time: message.sentAt,
						}))
					);
				}
			}
		}
	};

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
				time: new Date(),
			},
		]);
		setResponding(false);

		speak(textResponse.choices[0].message.content || "", settings.voice);
	};

	const toggleMute = () => {
		setMute((prev) => {
			if (audioRef.current) {
				if (prev) {
					audioRef.current.play();
				} else {
					audioRef.current.pause(); // Pause the audio if currently playing
				}
			}
			return !prev;
		});
	};

	const handleVoiceChange = async (value: SpeechCreateParams["voice"]) => {
		setSettings((prev) => ({ ...prev, voice: value }));

		messages.length && speak(
			messages
				.slice()
				.reverse()
				.find((message) => message.sentByAura).content,
			value
		);
	};

	async function encryptMessage(plaintext: string) {
		const response = await fetch("/api/encrypt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ plaintext }),
		});

		const { ciphertext, iv } = await response.json();
		return { ciphertext, iv };
	}

	async function decryptMessage(ciphertext: string, iv: string) {
		const response = await fetch("/api/decrypt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ciphertext, iv }),
		});
		const { plaintext } = await response.json();
		return plaintext;
	}

	return (
		<div
			className={`transition-all duration-500 ${
				fade ? "opacity-0" : "opacity-100"
			}`}
		>
			{/* Wavy Image */}
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

				{/* Voice Select */}
				<Select
					value={settings.voice}
					onValueChange={handleVoiceChange}
				>
					<SelectTrigger className="w-[180px] absolute top-0 left-0 m-4 bg-transparent text-white font-semibold ring-0 focus:ring-0 hover:bg-white/50 border-2">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="bg-transparent text-white font-semibold *:*:focus:text-white h-20 sm:h-36">
						{Object.entries(VOICE_OPTIONS).map(([key, value]: [string, any]) => (
							<SelectItem
								key={key}
								value={key}
								className="focus:text-white focus:bg-white/50"
							>
								{value.display_name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Mute Button */}
				<Button
					variant={"outline"}
					className="absolute top-0 right-0 m-4"
					onClick={toggleMute}
				>
					{mute ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
							/>
						</svg>
					)}
				</Button>

				{/* Let's Talk Button */}
				<Button
					variant={"outline"}
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
								if (
									e.key === "Enter" &&
									!e.shiftKey &&
									!responding
								) {
									e.preventDefault(); // Prevents the default action of entering a new line
									if (input) handleSend();
								}
							}}
						/>
						<div className="container flex justify-end mt-4 pr-0 ">
							<Button
								disabled={responding}
								onClick={error ? resend : handleSend}
							>
								{error ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
										/>
									</svg>
								) : (
									"Send"
								)}
							</Button>
						</div>
					</div>
				</div>
			)}

			<AlertDialog
				open={confirmEmailModal}
				onOpenChange={() => setConfirmEmailModal(false)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Account successfully created!
						</AlertDialogTitle>
						<AlertDialogDescription>
							In order to save your conversation history, keep
							this tab open and sign in after clicking the link in
							your email.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>
							<Button>Continue</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default Chat;
