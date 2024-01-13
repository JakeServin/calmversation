"use client";
import { useEffect, useRef } from "react";
import Message from "./Message";

interface Message {
	name: string;
	avatarFallback: string;
	avatarImage?: string;
	content: string;
	time: string;
}

type ChatLogProps = {
	messages: Array<Message>;
};

const ChatLog = ({ messages }: ChatLogProps) => {

	const chatLogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Scroll to the bottom of the chat log whenever the messages change
		if (chatLogRef.current) {
			chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
		}
	}, [messages]); 

	return (
		<div
			id="chat_log"
			className="container mt-5 min-h-40 max-h-72 overflow-scroll scroll-smooth"
			ref={chatLogRef}
		>
			{messages.map((message, index) => (
				<Message
					key={"message" + index}
					name={message.name}
					avatarFallback={message.avatarFallback}
					avatarImage={message.avatarImage}
					content={message.content}
					time={message.time}
				/>
			))}
		</div>
	);
};

export default ChatLog;
