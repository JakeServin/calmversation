"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
} from "./ui/sheet";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const Nav = () => {
	const path = usePathname();
	const { user, setUser, setMessages } = useStore();
	const router = useRouter();
	const { toast } = useToast();
	const supabase = createClientComponentClient();

	useEffect(() => {
		// Check if user is logged in
		reAuthenticate();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_IN") {
					session && setUser(session.user);
					toast({
						className: "bg-green-400 border-0 text-white",
						title: "Logged in!",
						description: "You are now logged in.",
					});

					// Sync Messages
					syncMessages();
				} else if (event === "SIGNED_OUT") {
					router.push("/");
					setUser(null);
					setMessages([]);
					toast({
						className: "bg-green-400 border-0 text-white",
						title: "Logged out!",
						description: "You are now logged out.",
					});
				}
			}
		);

		return () => {
			if (authListener && authListener.subscription)
				authListener.subscription.unsubscribe();
		};
	}, []);

	const reAuthenticate = async () => {
		const { data, error } = await supabase.auth.getUser();

		if (data?.user) {
			setUser(data.user);
		}
	};

	const syncMessages = async () => {};

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		}
	};

	return (
		!path.includes("success") && (
			<nav className="flex justify-between items-center pt-5 pb-3 container">
				{/* -- Logo -- */}
				<div className="">
					<Link href={"/"}>
						<Image
							src="/images/logo.png"
							alt="logo"
							width={200}
							height={50}
							className="h-full w-auto"
						/>
					</Link>
				</div>

				<Sheet>
					<SheetTrigger>
						{/* Hamburger Icon */}
						<div className="md:hidden *:*:hover:bg-gray-500 ml-8">
							<div className="space-y-2">
								{/* Hamburger Icon Lines */}
								<span className="block w-8 h-0.5 bg-black"></span>
								<span className="block w-8 h-0.5 bg-black"></span>
								<span className="block w-8 h-0.5 bg-black"></span>
							</div>
						</div>
					</SheetTrigger>
					<SheetContent className="w-[400px] sm:w-[540px]">
						<div className="h-full flex flex-col justify-between items-center w-full">
							{!user ? (
								// -- Auth --
								<div className="flex flex-col gap-2 mt-5 w-full">
									<Link href="/auth/login">
										<SheetClose className="w-full">
											<Button
												variant={"ghost"}
												className="text-lg sm:text-lg  w-full font-semibold rounded-full bg-secondary hover:bg-white hover:text-underline"
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
									<Separator className="my-2" />
									<Link
										href="https://www.gofundme.com/f/support-calmversation"
										target="_window"
									>
										<SheetClose className="w-full">
											<Button
												variant={"ghost"}
												className="text-lg sm:text-lg  w-full font-semibold rounded-full bg-secondary hover:bg-white"
											>
												Donate
											</Button>
										</SheetClose>
									</Link>
								</div>
							) : (
								<SheetClose className="w-full mt-5">
									<Button
										className="text-lg sm:text-lg sm:px-10 font-semibold rounded-full w-full"
										onClick={handleSignOut}
									>
										Sign out
									</Button>
								</SheetClose>
							)}
							<Image
								src="/images/logo.png"
								alt="logo"
								width={200}
								height={50}
								className=""
							/>
						</div>
					</SheetContent>
				</Sheet>
				{/* Menu Items */}
				<div className="hidden md:inline-block">
					<div className="flex gap-2">
						<Link
							href={
								"https://www.gofundme.com/f/support-calmversation"
							}
							target="_window"
						>
							<Button
								variant={"ghost"}
								className="text-lg sm:text-lg  w-full font-semibold rounded-full bg-white hover:bg-white"
							>
								Donate
							</Button>
						</Link>

						<Link
							href={"/talk"}
						>
							<Button
								variant={"ghost"}
								className="text-lg sm:text-lg  w-full font-semibold rounded-full bg-white hover:bg-white"
							>
								Chat
							</Button>
						</Link>

						{user ? (
							<>
								<div>
									<Separator orientation="vertical" />
								</div>
								<Link href="/settings/account">
									<Button
										variant={"ghost"}
										className="text-lg sm:text-lg  w-full font-semibold rounded-full bg-white hover:bg-white"
									>
										Account
									</Button>
								</Link>
								<Button
									className="text-lg sm:text-lg sm:px-10 font-semibold rounded-full "
									onClick={handleSignOut}
								>
									Sign out
								</Button>
							</>
						) : (
							<>
								<div>
									<Separator orientation="vertical" />
								</div>
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
						)}
					</div>
				</div>
			</nav>
		)
	);
};
