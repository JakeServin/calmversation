import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {

	return (
		<section className="container flex justify-between py-20">
			{/* Left */}
			<div className="sm:ml-5 md:w-1/2 sm:py-60">
				<h1 className="text-7xl font-bold sm:w-3/4 lg:text-8xl ">Let's talk about it.</h1>
				<div className="mt-8 w-3/2 text-lg text-gray-700">
					A safe space to express, reflect, and grow. I'm here to
					listen and support, whenever you need it.
				</div>

        <div className="mt-10">
          <Link href="/talk">
            <Button variant={'outline'} className="text-xl px-10 py-5 font-medium border-primary text-primary hover:bg-amber-50 hover:text-primary"> Chat Now </Button>
          </Link>
        </div>
			</div>

			{/* Right */}
      <div className="w-1/2 pl-20 py-20 hidden md:block">
        <Image alt="hero image" src="/images/hero_image.png" width={500} height={500} />
      </div>
		</section>
	);
};

export default Hero;
