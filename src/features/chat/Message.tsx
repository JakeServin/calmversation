"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Open_Sans, Roboto } from "next/font/google";
import { useEffect, useState } from "react";

type AiMessageProps = {
	time: string;
	content: string;
	name: string;
	sentByAura: boolean;
	onNewLine: () => void;
	triggerType: boolean;
};

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
});
const openSans = Open_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
});

const Message = ({
	time,
	content,
	name,
	sentByAura,
	onNewLine,
	triggerType,
}: AiMessageProps) => {
	const [typedContent, setTypedContent] = useState("");
	const typingSpeedMs = 70; // Adjust typing speed as needed

	useEffect(() => {
		let charIndex = 0;

		if (triggerType) {
			const typingInterval = setInterval(() => {
				if (charIndex < content.length) {
					setTypedContent(content.substring(0, charIndex + 1));
					charIndex++;
				} else {
					clearInterval(typingInterval);
				}
			}, typingSpeedMs);

			// Cleanup interval on component unmount
			return () => clearInterval(typingInterval);
		}
	}, [content, typingSpeedMs]);

	useEffect(() => {
		// Scroll to the bottom of the chat log whenever the messages change
		onNewLine();
	}, [typedContent]);

	return (
		<div className={`flex mb-2 ${openSans.className}`}>
			{/* Avatar */}
			<Avatar>
				<AvatarImage
					src={
						sentByAura
							? "https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv"
							: ""
					}
					alt="avatar image"
				/>
				<AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
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
				<div className="text-gray-600 mb-2 last:mb-0 text-sm">
					{triggerType ? typedContent : content}
				</div>
			</div>
		</div>
	);
};

export default Message;
