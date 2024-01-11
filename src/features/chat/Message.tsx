"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AiMessageProps = {
	time: string;
	messages: string[];
	name: string;
	avatarImage?: string;
	avatarFallback: string;
};

const Message = ({ time, messages, avatarImage, avatarFallback, name }: AiMessageProps) => {
	return (
		<div className="flex mb-2">
			{/* Avatar */}
			<Avatar>
				<AvatarImage
					src={avatarImage}
					alt="avatar image"
				/>
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

				{messages.map((message) => {
					return <div className="text-gray-600 mb-2">{message}</div>;
				})}
			</div>
		</div>
	);
};

export default Message;
