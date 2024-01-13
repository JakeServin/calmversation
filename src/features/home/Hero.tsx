"use client";
import { Button } from "@/components/ui/button";
import { Lora, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const lora = Lora({ subsets: ['latin'] })

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
			<div className="flex container py-20">
				{/* Left */}
				<div className="sm:ml-5 w-full md:w-1/2 sm:py-60">
					<h1 className={`text-7xl font-bold sm:w-3/4 lg:text-8xl`}>
						Let's talk about it.
					</h1>
					<div
						className={`mt-8 w-3/2 text-lg text-gray-700 ${lora.className}`}
					>
						A safe space to express, reflect, and grow. I'm here to
						listen and support, whenever you need it.
					</div>

					<div className="mt-10">
						<Link href="/talk">
							<Button
								variant={"outline"}
								className="text-xl px-10 py-5 font-semibold border-primary text-primary hover:bg-amber-50 hover:text-primary"
							>
								{" "}
								Chat Now{" "}
							</Button>
						</Link>
					</div>
				</div>

				{/* Right */}
				<div className="w-1/2 pl-20 py-20 hidden md:block">
					<Image
						alt="hero image"
						src="/images/hero_image.png"
						width={500}
						height={500}
					/>
				</div>
			</div>

			{/* App Description */}
			<div className="container bg-amber-100 p-8 md:p-16">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
					Empower Your Well-being With Every Conversation
				</h2>
				<p
					className={`text-md md:text-lg text-gray-700 mb-4 ${lora.className}`}
				>
					In a world that moves fast, finding a moment for yourself
					can be challenging. Calmversation is here to change that. At
					the heart of our mission is a simple belief: everyone
					deserves a space to reflect, speak freely, and be heard.
				</p>
				<p
					className={`text-md md:text-lg text-gray-700 mb-4 ${lora.className}`}
				>
					Our AI-powered companion, Aura, is a friendly voice that’s
					ready to listen to you 24/7. Whether you need to unwind
					after a long day, navigate complex feelings, or simply share
					your thoughts, Calmversation offers a safe and private
					environment to do just that. Engage in meaningful dialogue
					and discover insights that can help you grow.
				</p>
				<p
					className={`text-md md:text-lg text-gray-700 ${lora.className}`}
				>
					With Calmversation, every interaction is a step toward a
					more balanced and fulfilled you.
				</p>
			</div>
		</section>
	);
};

export default Hero;
