"use client";
import { SOCIALS } from "@/common/constants";
import { Lora } from "next/font/google";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

const lora = Lora({ subsets: ["latin"] });

const Footer = () => {
	const path = usePathname();

	return (
		!path.includes("auth") && (
			<footer className="flex justify-between py-10 bg-slate-100">
				<div className="container">
					<div className={"border-blue-500"}>
						<div className="text-xl font-bold">Calmversation</div>
						<div
							className={`text-sm text-gray-700 ${lora.className}`}
						>
							A simple tool to prioritze your well-being
						</div>
					</div>

					{/* Socials */}
					<div className="mt-5 text-sm">
						<div>
							Made with care by
							<a
								target="_window"
								href={"https://github.com/JakeServin"}
                className='text-gray-500'
							>
								{" "}
								@JakeServin{" "}
							</a>
						</div>
						<div className="flex gap-3 mt-2">
							{SOCIALS.map((social, index) => (
								<a
									href={social.href}
									target="_blank"
									key={index}
								>
									<Image
										src={social.src}
										alt={social.alt}
										width={25}
										height={25}
									/>
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Footer links */}
			</footer>
		)
	);
};

export default Footer;
