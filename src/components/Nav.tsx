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
import { useStore } from "@/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

export const Nav = () => {
	const path = usePathname();
	const { user, setUser } = useStore();
	const { toast } = useToast();
	const supabase = createClientComponentClient();

	useEffect(() => {
		if (!user) {
			reAuthenticate();
		}
	}, [])

	const reAuthenticate = async () => {

		const { data, error } = await supabase.auth.getUser();

		if (data?.user) {
			setUser(data.user);
		}
	};

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		}

		setUser(null);

		toast({
			className: "bg-green-400 border-0 text-white",
			title: "Logged out!",
			description: "You are now logged out.",
		});
	};

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
			<div className="flex gap-2">
				{!user ? (
					<>
						<Link href="/auth/login">
							<Button
								variant={"ghost"}
								className="text-lg sm:text-lg  w-full font-semibold rounded-full bg-white hover:bg-white"
							>
								Log in
							</Button>
						</Link>
						<Link href="/auth/signup">
							<Button className="text-lg sm:text-lg  w-full sm:px-10 font-semibold rounded-full ">
								Sign up
							</Button>
						</Link>
					</>
				) : (
					<Button
						className="text-lg sm:text-lg  w-full sm:px-10 font-semibold rounded-full "
						onClick={handleSignOut}
					>
						Sign out
					</Button>
				)}
			</div>
		</nav>
	);
};
