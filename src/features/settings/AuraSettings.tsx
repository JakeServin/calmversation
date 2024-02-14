import EditButton from '@/components/EditButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react'

const AuraSettings = () => {
  return (
		<div>
			<div className="text-xl font-medium">Aura Settings</div>

      <div className="relative border rounded-md p-5 mt-4">
				<EditButton />
        
        {/* Settings */}
        <div className='flex flex-col gap-2'>
          <div>
            <Label>Default Voice</Label>
            <div className="text-sm font-accent">Aura 1</div>
          </div>
          
          <div className='flex flex-col'>
            <Label>Mute&nbsp;</Label>
            <Switch className='mt-1' disabled/>
          </div>
        </div>
			</div>
		</div>
  );
}

export default AuraSettings