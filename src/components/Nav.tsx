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
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";

export const Nav = () => {
	const path = usePathname();
	const { user, setUser } = useStore();
	const { toast } = useToast();
	const supabase = createClientComponentClient();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			reAuthenticate();
		}
	}, []);

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

		router.push("/");
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

			<Sheet>
				<SheetTrigger>
					{/* Hamburger Icon */}
					<div className="md:hidden *:*:hover:bg-gray-500">
						<div className="space-y-2">
							{/* Hamburger Icon Lines */}
							<span className="block w-8 h-0.5 bg-black"></span>
							<span className="block w-8 h-0.5 bg-black"></span>
							<span className="block w-8 h-0.5 bg-black"></span>
						</div>
					</div>
				</SheetTrigger>
				<SheetContent className="w-[400px] sm:w-[540px]">
					{/* -- Auth -- */}
					<div className="flex flex-col gap-2 mt-5">
						<Link href="/auth/login">
							<SheetClose className="w-full">
								<Button
									variant={"ghost"}
									className="text-lg sm:text-lg  w-full font-semibold rounded-full bg-secondary hover:bg-white"
								>
									Log in
								</Button>
							</SheetClose>
						</Link>
						<Link href="/auth/signup">
							<SheetClose className="w-full">
								<Button className="text-lg sm:text-lg  w-full sm:px-10 font-semibold rounded-full ">
									Sign up
								</Button>
							</SheetClose>
						</Link>
					</div>
				</SheetContent>
			</Sheet>

			{!user ? (
				<>
					{/* Menu Items */}
					<div className={`hidden md:inline-block`}>
						{/* -- Auth -- */}
						<div className="flex gap-2">
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
						</div>
					</div>
				</>
			) : (
				<Button
					className="text-lg sm:text-lg  w-full sm:px-10 font-semibold rounded-full "
					onClick={handleSignOut}
				>
					Sign out
				</Button>
			)}
		</nav>
	);
};
