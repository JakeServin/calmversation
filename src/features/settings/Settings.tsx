"use client";
import { SETTINGS_MENU } from "@/common/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import AccountSettings from "./AccountSettings";
import AuraSettings from "./AuraSettings";
import Image from "next/image";
import { useStore } from "@/store";

interface SettingsProps {
	params: {
		[keys: string]: string;
	};
}

const Settings = ({ params }: SettingsProps) => {
	const { user } = useStore();

	return (
		<div className="container flex min-h-[calc(100vh-75px)] pt-5">
			{/* Left */}
			<div className="w-2/5 lg:w-1/4 flex flex-col mr-5">
				<div className="text-3xl font-bold">
					Settings
				</div>
				{SETTINGS_MENU.map((setting) => (
					<Link href={`/settings/${setting.slug}`}>
						<div
							className={`text-lg font-medium py-1 my-1 hover:bg-primary hover:cursor-pointer px-3 rounded flex ${
								setting.slug == params.setting && "bg-primary"
							}`}
						>
							<Image
								alt={setting.title}
								width={22}
								height={22}
								src={`/images/${setting.icon}.svg`}
							/>
							&nbsp;
							{setting.title}
						</div>
					</Link>
				))}
			</div>
			{/* Right */}
			<div className="w-3/5 lg:w-3/4">
				{params.setting == "account" ? (
					<AccountSettings />
				) : (
					<AuraSettings />
				)}
			</div>
		</div>
	);
};

export default Settings;
