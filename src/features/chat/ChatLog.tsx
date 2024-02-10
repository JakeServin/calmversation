"use client";
import { useEffect, useRef } from "react";
import Message from "./Message";
import { Message as MessageInterface } from "@/common/interfaces"

type ChatLogProps = {
	messages: Array<MessageInterface>;
	active: boolean;
};

const ChatLog = ({ messages, active }: ChatLogProps) => {
	const chatLogRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		if (chatLogRef.current) {
			chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		// Scroll to the bottom of the chat log whenever the messages change
		if (chatLogRef.current) {
			chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div
			id="chat_log"
			className="container px-0 mt-5 min-h-80 sm:min-h-48 max-h-[68vh] sm:max-h-80 overflow-scroll scroll-smooth"
			ref={chatLogRef}
		>
			{messages.map((message, index) => (
				<Message
					index={index}
					id={message.id}
					onNewLine={scrollToBottom}
					key={"message" + index}
					name={message.name}
					sentByAura={message.sentByAura}
					content={message.content}
					time={message.time}
					error={message?.error}
					triggerType={
						active &&
						index === messages.length - 1 &&
						message.name === "Aura"
					}
				/>
			))}
		</div>
	);
};

export default ChatLog;
