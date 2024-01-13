"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Open_Sans, Roboto } from "next/font/google";
import { useEffect, useState } from "react";

type AiMessageProps = {
	time: string;
	content: string;
	name: string;
	avatarImage?: string;
	avatarFallback: string;
	onNewLine: () => void;
};

const roboto = Roboto({ subsets: ["latin"], weight: ['100', '300', '400', '500', '700', '900'] });
const openSans = Open_Sans({ subsets: ["latin"], weight: ['300', '400', '500', '700'] });

const Message = ({
	time,
	content,
	avatarImage,
	avatarFallback,
	name,
	onNewLine
}: AiMessageProps) => {

	const [typedContent, setTypedContent] = useState("");
	const typingSpeedMs = 70; // Adjust typing speed as needed

	useEffect(() => {
		let charIndex = 0;

		const typingInterval = setInterval(() => {
			if (charIndex < content.length) {
				setTypedContent(
					content.substring(0, charIndex + 1)
				);
				charIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, typingSpeedMs);

		// Cleanup interval on component unmount
		return () => clearInterval(typingInterval);
	}, [content, typingSpeedMs]);

	useEffect(() => {
		// Scroll to the bottom of the chat log whenever the messages change
		onNewLine();
	}, [typedContent]);

	return (
		<div className={`flex mb-2 ${openSans.className}`}>
			{/* Avatar */}
			<Avatar>
				<AvatarImage src={avatarImage} alt="avatar image" />
				<AvatarFallback>{avatarFallback}</AvatarFallback>
			</Avatar>

			{/* Message */}
			<div className="ml-4">
				{/* Message Title */}
				<div>
					<span className="font-semibold">{name}</span>
					<span className="ml-1 text-sm text-thin text-gray-700">
						{time}
					</span>
				</div>

				{/* Message Content */}
				<div className="text-gray-600 mb-2 last:mb-0 text-sm">{name == "Aura" ? typedContent : content}</div>
			</div>
		</div>
	);
};

export default Message;
