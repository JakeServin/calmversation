"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import {
	AlertDialog,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

export const Nav = () => {
	return (
		<nav className="flex justify-between items-center py-5 container px-10">
			{/* -- Logo -- */}
			<div>
				<Link href={"/"}>
					<span className="text-3xl font-bold">Calmversation</span>
				</Link>
			</div>

			{/* -- Auth -- */}
			<Link href="/talk">
				<Button className="text-lg  w-full px-10">Chat Now</Button>
			</Link>
		</nav>
	);
};
