"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React, { useState } from "react";
import { lora } from "@/common/fonts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";

const LogIn = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
	const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {setUser} = useStore();

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
			password
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
      className: 'bg-green-400 border-0 text-white',
      title: 'Logged in!',
      description: 'You are now logged in.'
    })
    router.push('/talk')
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

				<div className="w-full ">
					<div className="bg-blue-500 text-white text-center rounded-full py-3 text-xs">
						Continue with Google
					</div>
				</div>
				<Separator className="my-4" />
				{/* OAUTH */}

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
