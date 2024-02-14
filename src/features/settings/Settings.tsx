"use client";
import { SETTINGS_MENU } from "@/common/constants";
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
		<div className="mx-4 sm:container flex min-h-[calc(100vh-75px)] pt-5">
			{/* Left */}
			<div className="sm:w-2/5 lg:w-1/4 flex flex-col mr-5">
				<div className="hidden sm:inline-block text-3xl font-bold">
					Settings
				</div>
				{SETTINGS_MENU.map((setting) => (
					<Link key={setting.slug} href={`/settings/${setting.slug}`}>
						<div
							key={setting.slug}
							className={`items-center text-lg font-medium py-1 my-1 hover:bg-primary hover:cursor-pointer px-3 rounded flex ${
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
							<div className="hidden sm:inline-block">
								{setting.title}
							</div>
						</div>
					</Link>
				))}
			</div>
			{/* Right */}
			<div className="w-full sm:w-3/5 lg:w-3/4">
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
