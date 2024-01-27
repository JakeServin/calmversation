"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import moment from "moment";
import { Open_Sans, Roboto } from "next/font/google";
import { useEffect, useState } from "react";

type AiMessageProps = {
	index: number;
	id?: string,
	time: Date;
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
	index,
	id,
	time,
	content,
	name,
	sentByAura,
	onNewLine,
	triggerType,
}: AiMessageProps) => {
	const supabase = createClientComponentClient();
	const { setMessages, user} = useStore();
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
	}, [content, typingSpeedMs, triggerType]);

	useEffect(() => {
		// Scroll to the bottom of the chat log whenever the messages change
		onNewLine();
	}, [typedContent]);

	const handleDelete = async () => {
		if (user) {
			console.log(id)
			// Delete message from database
			const { data, error } = await supabase
				.from("messages")
				.delete()
				.eq("id", id);

			if (error) {
				console.error(error);
				return;
			}


			// Delete message from state by id
			setMessages((prev) => prev.filter((message) => message.id !== id));
		} else {
			// Delete message from state by index
			setMessages((prev) => prev.filter((message, i) => i !== index));
		}
	};

	return (
		<div
			className={`group flex p-2 pl-2 ${openSans.className} hover:bg-gray-50 rounded-xl`}
		>
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

			<div className="flex justify-between w-full items-center"> 
				{/* Message */}
				<div className="ml-4 w-full">
					{/* Message Title */}
					<div>
						<span className="font-semibold">{name}</span>
						<span className="ml-1 text-sm text-thin text-gray-700">
							{moment(time).format("h:mm A")}
						</span>
					</div>

					{/* Message Content */}
					<div className="text-gray-600 mb-2 last:mb-0 text-sm">
						{triggerType ? typedContent : content}
					</div>
				</div>

				{/* Trash */}
				<div
					className="p-2 mr-2 rounded group-hover:opacity-100 opacity-0 hover:bg-gray-200 hover:cursor-pointer group-first:hidden"
					onClick={(index != 0) ? handleDelete : undefined}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-4 h-4 text-gray-600"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>

		</div>
	);
};

export default Message;
