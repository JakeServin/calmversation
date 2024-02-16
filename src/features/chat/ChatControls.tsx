import { VOICE_OPTIONS } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from '@/interfaces';
import Image from 'next/image';
import { SpeechCreateParams } from 'openai/resources/audio/speech.mjs';
import React from 'react'

const ChatControls = ({
	isExpanded,
	toggleMute,
	handleVoiceChange,
	mute,
  settings,
  handleButtonClick
}: {
	isExpanded: boolean;
	toggleMute: () => void;
	mute: boolean;
	settings: Settings;
	handleVoiceChange: (value: SpeechCreateParams["voice"]) => Promise<void>;
	handleButtonClick: () => Promise<void>;
}) => {
	return (
		<div
			className={`${
				isExpanded ? "h-[calc(100vh-75px)]" : "h-[20vh] sm:h-[40vh]"
			} transition-all duration-500 relative rounded-lg border-2 container`}
		>
			<Image
				src="https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv"
				alt="talk"
				layout="fill"
				objectFit="cover"
				className="rounded"
			/>

			{/* Voice Select */}
			<Select value={settings.voice} onValueChange={handleVoiceChange}>
				<SelectTrigger className="w-[180px] absolute top-0 left-0 m-4 bg-transparent text-white font-semibold ring-0 focus:ring-0 hover:bg-white/50 border-2">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="bg-transparent text-white font-semibold *:*:focus:text-white h-20 sm:h-36">
					{Object.entries(VOICE_OPTIONS).map(
						([key, value]: [string, any]) => (
							<SelectItem
								key={key}
								value={key}
								className="focus:text-white focus:bg-white/50"
							>
								{value.display_name}
							</SelectItem>
						)
					)}
				</SelectContent>
			</Select>

			{/* Mute Button */}
			<Button
				variant={"outline"}
				className="absolute top-0 right-0 m-4"
				onClick={toggleMute}
			>
				{mute ? (
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
							d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
						/>
					</svg>
				) : (
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
							d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
						/>
					</svg>
				)}
			</Button>

			{/* Let's Talk Button */}
			<Button
				variant={"outline"}
				className={`${
					!isExpanded ? "opacity-0" : "opacity-100"
				} transition-all duration-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl px-10 py-8 font-semibold`}
				onClick={handleButtonClick}
			>
				Let&apos;s Talk
			</Button>
		</div>
	);
};

export default ChatControls