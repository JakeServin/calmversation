export interface Message {
	name: string;
	content: string;
	sentByAura: boolean;
	time: Date;
	id?: string;
	error?: boolean;
}