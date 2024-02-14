import EditButton from "@/components/EditButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useStore } from "@/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";

const AccountSettings = () => {
	const { profile, setProfile, user } = useStore();
	const [edit, setEdit] = useState(false);
	const [name, setName] = useState("");
	const supabase = createClientComponentClient();

	useEffect(() => {
		setName(profile?.name ?? "");
	}, [profile, edit]);

	const handleSave = async () => {
		if (!name.length)
			return toast({
				variant: "destructive",
				title: "Name is required",
				description: "Please enter your name.",
			});
		const { data, error } = await supabase
			.from("profiles")
			.update({ name })
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
			<div className="text-xl font-medium">Account Settings</div>

			<div className="relative border rounded-md p-5 mt-4">
				{!edit && <EditButton onClick={() => setEdit(true)} />}

				{/* Settings */}
				<div className="flex flex-col gap-2">
					<div>
						<Label>Name</Label>
						{!edit ? (
							<div className="text-sm font-accent">
								{profile?.name ?? ""}
							</div>
						) : (
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						)}
					</div>

					<div>
						<Label>Email</Label>
						<div className="text-sm font-accent">
							{profile?.email ?? ""}
						</div>
					</div>
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
	);
};

export default AccountSettings;
