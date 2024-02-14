import { VOICE_OPTIONS } from "@/common/constants";
import EditButton from "@/components/EditButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useStore } from "@/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";

const AuraSettings = () => {
	const { profile, setProfile, user } = useStore();
	const [edit, setEdit] = useState(false);
	const [voice, setVoice] = useState("AURA_1");
	const [mute, setMute] = useState(false);
	const supabase = createClientComponentClient();

	useEffect(() => {
		setVoice(profile?.voice_preference ?? "AURA_1");
		setMute(profile?.mute ?? false);
	}, [profile]);

	const handleSave = async () => {
		const { data, error } = await supabase
			.from("profiles")
			.update({ voice_preference: voice, mute })
			.eq("id", user?.id)
			.select();
		setEdit(false);
		toast({
			title: "Profile Updated",
			description: "Your profile has been updated.",
		});
	};

	return (
		<div>
			<div className="text-xl font-medium">Aura Settings</div>

			<div className="relative border rounded-md p-5 mt-4">
				{!edit && <EditButton onClick={() => setEdit(true)} />}

				{/* Settings */}
				<div className="flex flex-col gap-2">
					<div>
						<Label>Default Voice</Label>
						{!edit ? (
							<div className="text-sm font-accent">
								{VOICE_OPTIONS?.[
									profile?.voice_preference ?? ""
								]?.display_name ?? "Aura 1"}
							</div>
						) : (
							<Select
								value={voice}
								onValueChange={(value) => setVoice(value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(VOICE_OPTIONS)?.map(
										([option, value]) => (
											<SelectItem key={option} value={option}>
												{value.display_name}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						)}
					</div>

					<div className="flex flex-col">
						<Label>Mute&nbsp;</Label>
						<Switch
							className="mt-1"
							disabled={!edit}
							checked={mute}
							onCheckedChange={() => setMute(!mute)}
						/>
					</div>

					{/* Edit Buttons */}
					{edit && (
						<div className="w-full flex justify-end gap-2">
							<Button
								variant={"secondary"}
								onClick={() => setEdit(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleSave}>Save</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuraSettings;
