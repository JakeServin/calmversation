"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React, { useState } from "react";
import { lora } from "@/common/fonts";
import {
	Form,
	FormControl,
	FormDescription,
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
import { set } from "date-fns";
import { useRouter } from "next/navigation";

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
	const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false)

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
      .from("Profiles")
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
    setLoading(true)
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: "localhost:3000/auth/signin",
			},
		});
    setLoading(false)

		if (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
      });
      
      return;
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from("Profiles")
      .insert([{ displayName: name, email, id: data?.user?.id, createdAt: new Date() }]);
    
    if (profileError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: profileError.message,
      });

      return;
    }

    toast({
      title: "Success!",
      description: "Account created",
    })

    // Redirect to dashboard
    router.push("/auth/signup/success");

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
					<div className="bg-blue-500 text-white text-center rounded-full py-3 text-xs">
						Continue with Google
					</div>
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
							className="space-y-2"
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
							<FormField
								control={form.control}
								name="confirm"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Confirm password"
												type="password"
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
