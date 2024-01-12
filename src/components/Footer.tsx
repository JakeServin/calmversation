import { SOCIALS } from '@/constants';
import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
		<footer className="container flex justify-between py-10 bg-slate-100">
			<div>
				<div className={"border-blue-500"}>
					<div className="text-xl font-bold">Calmversation</div>
					<div className="text-sm text-gray-700">
						A simple tool to prioritze your well-being
					</div>
				</div>

				{/* Socials */}
				<div className="mt-5 text-sm">
					<div>Made with care by @JakeServin</div>
          <div className="flex gap-3 mt-2">
            {SOCIALS.map((social, index) => (
              <a href={social.href} target='_blank' key={index}>
                <Image src={social.src} alt={social.alt} width={25} height={25} />
              </a>
            ))}
					</div>
				</div>
			</div>

			{/* Footer links */}
		</footer>
  );
}

export default Footer