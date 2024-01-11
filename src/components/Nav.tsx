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
		<nav className="flex justify-between items-center pt-5 pb-3 container">
			{/* -- Logo -- */}
			<div>
				<Link href={"/"}>
					<span className="text-3xl font-semibold">Calmversation</span>
				</Link>
			</div>

			{/* -- Auth -- */}
			<Link href="/talk">
				<Button className="sm:text-lg  w-full sm:px-10">Chat Now</Button>
			</Link>
		</nav>
	);
};
