import React from 'react'

const Footer = () => {
  return (
    <footer className='container flex justify-between py-10 bg-slate-100'>

      <div>
        <div className={'border-blue-500'}>
          <div className='text-xl font-bold'>Calmversation</div>
          <div className='text-sm text-gray-700'>A simple tool to prioritze your well-being</div>
        </div>

        {/* Socials */}
        <div className='mt-5 text-sm'>
          <div>Made by @JakeServin</div>
          <div></div>
        </div>
      </div>

      {/* Footer links */}
    </footer>
  )
}

export default Footer