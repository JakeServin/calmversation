import { useState, useEffect, useRef } from "react";
import { useStore } from "@/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "@/components/ui/use-toast";
import { CHAT_PROMPT } from "@/common/constants";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

export const useChat = (searchParams: {
	[key: string]: string | string[] | undefined;
}) => {
	const [fade, setFade] = useState(true);
	const { messages, setMessages, user, settings, setSettings, profile } =
		useStore();
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
		if (profile) {
			setMute(profile?.mute ?? false);
			setSettings((prev) => ({
				...prev,
				voice: profile?.voice_preference ?? "AURA_1",
			}));
		}
	}, [profile]);

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
		if (user?.id) {
			supabase
				.from("profiles")
				.update({ mute: !mute })
				.eq("id", user?.id)
				.then();
		}

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
		if (user?.id) {
			supabase
				.from("profiles")
				.update({ voice_preference: value })
				.eq("id", user?.id)
				.then();
		}

		messages.length &&
			speak(
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

	return {
		input,
		setInput,
		isExpanded,
		setIsExpanded,
		confirmEmailModal,
		setConfirmEmailModal,
		mute,
		toggleMute,
		responding,
		handleSend,
		messages,
    setMessages,
    resend,
    handleButtonClick,
    fade,
    active,
    error,
    handleVoiceChange,
    settings
	};
};