import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

export interface Settings {
  voice: string;
}

export interface VoiceOptions {
	[key: string]: {
		voice_id: SpeechCreateParams["voice"];
		display_name: string;
	};
}

export interface Message {
	name: string;
	content: string;
	sentByAura: boolean;
	time: Date;
	id?: string;
	error?: boolean;
}
