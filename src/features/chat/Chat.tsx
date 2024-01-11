import React from 'react'
import ChatLog from './ChatLog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const Chat = () => {
  return (
    <div>
      <ChatLog />

      {/* Chat Input */}
      <div className="my-5 h-fill container">
        <Textarea className='container p-5' placeholder='Type your message here' />
        <div className='container flex justify-end mt-4 pr-0'>
          <Button className=''>Send</Button>
        </div>
      </div>
    </div>
  )
}

export default Chat