"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Lora, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Footer } from "react-day-picker";

const lora = Lora({ subsets: ["latin"] });

const Hero = () => {
	const [fade, setFade] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setFade(false);
		}, 100);
	}, []);

	return (
		<section
			className={`flex flex-col justify-between transition-all duration-700 ${
				(fade ? "opacity-0" : "opacity-100") + " "
			}`}
		>
			<div className="flex container py-20 items-center">
				{/* Left */}
				<div className=" w-full md:w-1/2 sm:py-80">
					<h1 className={`text-7xl font-bold lg:text-8xl`}>
						Let&apos;s talk about it.
					</h1>
					<div
						className={`mt-8 w-3/2 text-lg text-gray-700 ${lora.className}`}
					>
						A safe space to express, reflect, and grow. I&apos;m
						here to listen and support, whenever you need it.
					</div>

					<div className="mt-10">
						<Link href="/talk">
							<Button
								variant={"outline"}
								className="text-xl px-10 py-5 font-semibold border-primary text-primary hover:bg-amber-50 hover:bg-opacity-100 hover:text-primary w-full sm:w-auto"
							>
								{" "}
								Chat Now{" "}
							</Button>
						</Link>
					</div>
				</div>

				{/* Right */}
				<div className="w-1/2 min-w-[500px] pl-20 mb-32 hidden md:block">
					<Image
						alt="hero image"
						src="/images/hero_image.png"
						width={600}
						height={600}
					/>
				</div>
			</div>
			<div>
				<Image
					alt="lotus"
					src="/images/lotus.png"
					width={100}
					height={75}
					className="mx-auto "
				/>
			</div>
			{/* <div className="container px-10 md:hidden">
				<Separator className="h-1 bg-emerald-200" />
			</div> */}
			{/* App Description */}
			<div className="py-20">
				<div className="container">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
						Empower Your Well-being With Every Conversation
					</h2>
					<p
						className={`text-md md:text-lg text-gray-700 mb-4 ${lora.className}`}
					>
						In a world that moves fast, finding a moment for
						yourself can be challenging. Calmversation is here to
						change that. At the heart of our mission is a simple
						belief: everyone deserves a space to reflect, speak
						freely, and be heard.
					</p>
					<p
						className={`text-md md:text-lg text-gray-700 mb-4 ${lora.className}`}
					>
						Our AI-powered companion, Aura, is a friendly voice
						that&apos;s ready to listen to you 24/7. Whether you
						need to unwind after a long day, navigate complex
						feelings, or simply share your thoughts, Calmversation
						offers a safe and private environment to do just that.
						Engage in meaningful dialogue and discover insights that
						can help you grow. Plus, with an account, you can
						preserve these exchanges securely, with encrypted
						messaging for your peace of mind.
					</p>
					<p
						className={`text-md md:text-lg text-gray-700 ${lora.className}`}
					>
						With Calmversation, every interaction is a step toward a
						more balanced and fulfilled you.
					</p>
				</div>
			</div>
			{/* Donation */}
			<div className="bg-amber-100 py-20">
				<div className="container">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
						Support Our Mission
					</h2>
					<p
						className={`text-md md:text-lg text-gray-700 mb-4 ${lora.className}`}
					>
						Calmversation is fueled by the generosity of individuals
						like you. If you&apos;ve found value in our service and
						wish to ensure it remains available for those in need,
						consider{" "}
						<a
							className="text-amber-500 hover:underline"
							href="https://www.gofundme.com/f/support-calmversation"
						>
							supporting us with a donation.
						</a>{" "}
						Your contribution helps us cover the costs of
						maintaining and improving this platform.
					</p>
					<p
						className={`text-md md:text-lg text-gray-700 mb-4 ${lora.className}`}
					>
						Not in a position to donate? That&apos;s perfectly okay.
						Sharing Calmversation with someone who might benefit is
						a wonderful way to support our mission. Each
						conversation started, each moment of reflection, adds to
						the collective well-being that we are striving to
						nurture.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Hero;
