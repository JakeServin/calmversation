export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			messages: {
				Row: {
					content: string | null;
					createdAt: string;
					id: string;
					iv: string | null;
					sentAt: string | null;
					sentByAura: boolean | null;
					threadId: string | null;
				};
				Insert: {
					content?: string | null;
					createdAt?: string;
					id?: string;
					iv?: string | null;
					sentAt?: string | null;
					sentByAura?: boolean | null;
					threadId?: string | null;
				};
				Update: {
					content?: string | null;
					createdAt?: string;
					id?: string;
					iv?: string | null;
					sentAt?: string | null;
					sentByAura?: boolean | null;
					threadId?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "messages_threadId_fkey";
						columns: ["threadId"];
						isOneToOne: false;
						referencedRelation: "threads";
						referencedColumns: ["id"];
					}
				];
			};
			profiles: {
				Row: {
					created_at: string | null;
					email: string | null;
					id: string;
					mute: boolean | null;
					name: string | null;
					voice_preference: string | null;
				};
				Insert: {
					created_at?: string | null;
					email?: string | null;
					id: string;
					mute?: boolean | null;
					name?: string | null;
					voice_preference?: string | null;
				};
				Update: {
					created_at?: string | null;
					email?: string | null;
					id?: string;
					mute?: boolean | null;
					name?: string | null;
					voice_preference?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "profiles_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			threads: {
				Row: {
					created_at: string;
					id: string;
					userId: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					userId: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: "threads_userId_fkey";
						columns: ["userId"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database["public"]["Tables"] & Database["public"]["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
			Database["public"]["Views"])
	? (Database["public"]["Tables"] &
			Database["public"]["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof Database["public"]["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
	? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof Database["public"]["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
	? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof Database["public"]["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
	? Database["public"]["Enums"][PublicEnumNameOrOptions]
	: never;
