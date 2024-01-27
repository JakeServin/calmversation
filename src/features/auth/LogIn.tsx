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
import { useStore } from "@/store";
import Image from "next/image";

const LogIn = () => {
	const supabase = createClientComponentClient();
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const { setUser, messages, setMessages } = useStore();

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
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { email, password } = values;

		setLoading(true);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		setLoading(false);

		if (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
			return;
		}

		setUser(data?.user);

		toast({
			className: "bg-green-400 border-0 text-white",
			title: "Logged in!",
			description: "You are now logged in.",
		});
		router.push("/talk");
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

		data.url && window.open(data.url, "googleAuth", "width=500,height=600");
	}

	return (
		<div className="flex justify-center">
			<div className="flex flex-col p-7 border-2 items-center rounded-xl my-10 mx-14 md:mx-40 w-full lg:max-w-[670px]">
				<h1 className={`my-4 text-4xl font-medium ${lora.className}`}>
					Log in
				</h1>
				{/* FORM */}
				<div className="w-full grid gap-5">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-2"
						>
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
												autoComplete="current-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full">
								<Button
									className="w-full rounded-full mt-4"
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
										"Log in"
									)}
								</Button>
							</div>{" "}
						</form>
					</Form>
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
					<div
						id="g_id_onload"
						data-client_id="YOUR_GOOGLE_CLIENT_ID"
						data-login_uri="https://your.domain/your_login_endpoint"
						data-your_own_param_1_to_login="any_value"
						data-your_own_param_2_to_login="any_value"
					></div>
				</div>

				<div className="my-5">
					<p className="text-xs text-gray-500">
						Don&apos;t have an account?{" "}
						<Link href="/auth/signup" className="text-blue-500">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LogIn;

const formSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(1, { message: "Password is required" })
		.min(5, { message: "Password must be at least 5 characters long" }),
});
