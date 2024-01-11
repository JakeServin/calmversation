import Chat from '@/features/chat/Chat';
import Image from 'next/image'
import React from 'react'

const Talk = () => {
  return (
		<div>

			{/* Image */}
			<div className='h-[20vh] sm:h-[40vh] relative rounded-lg border-2 container'>
				<Image
					src="https://64.media.tumblr.com/6cb0ae44278156aa660d95d55df340de/tumblr_nz14o7t0Z61skcd7fo1_500.gifv"
          alt="talk"
					// width={100}
          // height={100}
          layout='fill'
          objectFit='cover'
          className='rounded'
				/>
      </div>
      
      {/* Chat */}
      <Chat />
		</div>
  );
}

export default Talk