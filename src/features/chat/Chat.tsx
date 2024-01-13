"use client";
import ChatLog from "./ChatLog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import useChat from "@/hooks/useChat";

interface Message {
	name: string;
	avatarFallback: string;
	avatarImage?: string;
	content: string;
	time: string;
}

const Chat = () => {
	const [fade, setFade] = useState(true);
	const { messages, isExpanded, input, setInput, responding, startConversation, handleSend } = useChat();

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
					} transition-all duration-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl px-10 py-8`}
					onClick={handleButtonClick}
				>
					Let's Talk
				</Button>
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
