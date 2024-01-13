"use client";
import { useEffect } from "react";
import Message from "./Message";

interface Message {
	name: string;
	avatarFallback: string;
	avatarImage?: string;
	messages: string[];
	time: string;
}

type ChatLogProps = {
	messages: Array<Message>;
};

const ChatLog = ({messages}: ChatLogProps) => {

	return (
		<div
			id="chat_log"
			className="container mt-5 min-h-40 max-h-72 overflow-scroll scroll-smooth"
		>
			{messages.map((message, index) => (
				<Message
					key={index}
					name={message.name}
					avatarFallback={message.avatarFallback}
					avatarImage={message.avatarImage}
					messages={message.messages}
					time={message.time}
				/>
			))}
		</div>
	);
};

export default ChatLog;
