import React, { Dispatch, SetStateAction } from "react";
import ChatLog from "./ChatLog";
import { Textarea } from "@/components/ui/textarea";
import { openSans } from "@/common/fonts";
import { Button } from "@/components/ui/button";

const ChatInput = ({input, setInput, handleSend, error, resend, responding }: {
	input: string;
	setInput: Dispatch<SetStateAction<string>>;
	handleSend: () => Promise<void>;
	error: any;
	resend: () => void;
	responding: boolean;
}) => {
	return (
		<div
			className={`my-5 h-fill ${openSans.className} px-0 relative container`}
		>
			<Textarea
				className={`p-5 text-base`}
				placeholder="Type your message here"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey && !responding) {
						e.preventDefault(); // Prevents the default action of entering a new line
						if (input) handleSend();
					}
				}}
			/>
			<Button
				disabled={responding}
				onClick={error ? resend : handleSend}
				className="absolute bottom-0 right-0 m-3"
				size={"sm"}
			>
				{error ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				) : (
					"Send"
				)}
			</Button>
		</div>
	);
};

export default ChatInput;
