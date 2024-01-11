"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserMessageProps = {
	time: string;
	messages: string[];
};

const UserMessage = ({ time, messages }: UserMessageProps) => {
	return (
		<div className="flex">
			{/* Avatar */}
			<Avatar>
				<AvatarImage
					alt="@shadcn"
				/>
				<AvatarFallback className="">U</AvatarFallback>
			</Avatar>

			{/* Message */}
			<div className="ml-4">
				{/* Message Title */}
				<div>
					<span className="font-semibold">User</span>
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

export default UserMessage;
