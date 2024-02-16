"use client";
import ChatLog from "./ChatLog";
import { useStore } from "@/store";
import { useChat } from "@/hooks/useChat";
import ChatControls from "./ChatControls";
import ChatInput from "./ChatInput";
import ConfirmEmailModal from "./ConfirmEmailModal";

const Chat = ({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const {
		handleSend,
		input,
		setInput,
		isExpanded,
		toggleMute,
		handleVoiceChange,
		confirmEmailModal,
		setConfirmEmailModal,
		mute,
		settings,
		resend,
		handleButtonClick,
		fade,
		active,
		error,
		responding,
	} = useChat(searchParams);
	const {messages} = useStore()


	return (
		<div
			className={`transition-all duration-500 ${
				fade ? "opacity-0" : "opacity-100"
			}`}
		>
			<ChatControls
				isExpanded={isExpanded}
				toggleMute={toggleMute}
				mute={mute}
				settings={settings}
				handleVoiceChange={handleVoiceChange}
				handleButtonClick={handleButtonClick}
			/>

			{!isExpanded && (
				<>
					<ChatLog messages={messages} active={active} />
					<ChatInput
						input={input}
						setInput={setInput}
						handleSend={handleSend}
						error={error}
						resend={resend}
						responding={responding}
					/>
				</>
			)}

			<ConfirmEmailModal confirmEmailModal={confirmEmailModal} setConfirmEmailModal={setConfirmEmailModal} />
		</div>
	);
};

export default Chat;
