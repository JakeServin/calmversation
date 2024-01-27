"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { lora } from "@/common/fonts";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/store";

const formSchema = z
	.object({
		email: z.string().email(),
		password: z
			.string()
			.min(1, { message: "Password is required" })
			.min(5, { message: "Password must be at least 5 characters long" }),
		confirm: z.string().min(1, { message: "Password is required" }),
		name: z.string().min(1, { message: "Name is required" }),
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords don't match",
		path: ["confirm"],
	});

const SignUp = () => {
	const router = useRouter();
	const supabase = createClientComponentClient()
	const { messages } = useStore();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_IN") {
					router.push("/talk");
				}
			}
		);

		return () => {
			if (authListener && authListener.subscription)
				authListener.subscription.unsubscribe();
		};
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirm: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { name, email, password } = values;

		// Verify user doesn't already exist
		const { data: user } = await supabase
			.from("profiles")
			.select("*")
			.eq("email", email);

		if (user?.length) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "A user with that email already exists.",
			});
			return;
		}

		// Create user
		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo:
					"https://calmversation-git-auth-jakeservin.vercel.app/auth/signin",
				data: {
					name,
				},
			},
		});
		setLoading(false);

		if (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});

			return;
		} else {

			// Redirect to dashboard
			router.push("/talk?newUser=true");

		}
	}

	async function handleGoogleSignIn() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				skipBrowserRedirect: true,
				redirectTo:
					"https://calmversation-git-auth-jakeservin.vercel.app/auth/login/success",
			},
		});

		if (error) console.error("Login error", error);

		// Create an anchor element
		const anchor = document.createElement("a");
		anchor.href = data.url ?? ''; // OAuth URL obtained from the response
		anchor.target = "_blank"; // Open in a new tab
		anchor.rel = "noopener noreferrer"; // Security measure
		document.body.appendChild(anchor); // Append to body

		// Simulate a click
		anchor.click();
	}

	return (
		<div className="flex justify-center">
			<div className="flex flex-col p-7 border-2 items-center rounded-xl my-10 mx-14 md:mx-40 w-full lg:max-w-[670px]">
				<h1 className={`mt-4 text-4xl font-medium ${lora.className}`}>
					Sign up
				</h1>

				<p className="text-sm text-gray-500 my-4">
					Sign up to save your conversation history, so Aura can stay
					updated
				</p>

				{/* OAUTH */}
				<div className="w-full ">
					<Button
						onClick={handleGoogleSignIn}
						className="bg-blue-500 text-white text-center rounded-full py-2 text-xs flex justify-center items-center gap-2 w-full hover:bg-blue-400"
					>
						<div className="bg-white rounded-full p-1">
							<Image
								src="/images/google.svg"
								alt="google"
								width={20}
								height={20}
							/>
						</div>
						Continue with Google
					</Button>
				</div>

				<div className="flex w-full items-center my-1">
					<div className="grow">
						<Separator className="my-4" />
					</div>
					<div>
						<p className="text-sm text-gray-500 mx-4">or</p>
					</div>
					<div className="grow">
						<Separator className="my-4" />
					</div>
				</div>

				{/* FORM */}
				<div className="w-full grid gap-5">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-2 *:text-base"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="What should we call you?"
												autoComplete="name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="example@mail.com"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												placeholder="Password (5 or more characters)"
												type="password"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirm"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Confirm password"
												type="password"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full my-4">
								<Button
									className="w-full rounded-full my-4"
									disabled={loading}
								>
									{loading ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 animate-spin"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
											/>
										</svg>
									) : (
										"Sign up"
									)}
								</Button>
							</div>{" "}
						</form>
					</Form>
				</div>

				<div className="my-1">
					<p className="text-xs text-gray-500">
						Conversations with Aura are encrypted and will never be
						seen by anyone but you.
					</p>
				</div>

				<div className="my-4">
					<p className="text-xs text-gray-500">
						Already have an account?{" "}
						<Link href="/auth/login" className="text-blue-500">
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
