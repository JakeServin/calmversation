import Message from "./Message";
import UserMessage from "./UserMessage";

const ChatLog = () => {
	const messages = [
		"Not much, you?",
		"I'm good, thanks for asking.",
		"What's up?",
		"Hey, how's it going?",
	];

	return (
		<div className="container mt-5 h-fill h-96  overflow-scroll">
			<Message
				name="Aura"
				avatarFallback="A"
				avatarImage="https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv"
				messages={messages}
				time={"11:46 AM"}
			/>
			<Message
				name="User"
				avatarFallback="U"
				messages={messages}
				time={"11:46 AM"}
			/>
			<Message
				name="User"
				avatarFallback="U"
				messages={messages}
				time={"11:46 AM"}
			/>
			<Message
				name="User"
				avatarFallback="U"
				messages={messages}
				time={"11:46 AM"}
			/>
		</div>
	);
};

export default ChatLog;
