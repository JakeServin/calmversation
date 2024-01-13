"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

export const Nav = () => {
	const path = usePathname();

	return (
		<nav className="flex justify-between items-center pt-5 pb-3 container">
			{/* -- Logo -- */}
			<div>
				{path == "/talk" ? (
					<AlertDialog>
						<AlertDialogTrigger>
							<span className="text-3xl font-bold">
								Calmversation
							</span>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Hold on! You&apos;ve got an ongoing chat.
								</AlertDialogTitle>
								<AlertDialogDescription>
									If you leave now, you&apos;ll exit the
									conversation. Are you sure you want go?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<Link href={"/"}>
									<AlertDialogAction className="w-full">
										Quit
									</AlertDialogAction>
								</Link>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				) : (
					<Link href={"/"}>
						<span className="text-3xl font-bold">
							Calmversation
						</span>
					</Link>
				)}
			</div>

			{/* -- Auth -- */}
			{path != "/talk" && (
				<Link href="/talk">
					<Button className="text-lg sm:text-lg  w-full sm:px-10 font-semibold">
						Chat Now
					</Button>
				</Link>
			)}
		</nav>
	);
};
