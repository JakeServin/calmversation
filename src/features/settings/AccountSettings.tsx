import EditButton from '@/components/EditButton';
import { Label } from '@/components/ui/label'
import React from 'react'

const AccountSettings = () => {
  return (
		<div>
			<div className="text-xl font-medium">Account Settings</div>

			<div className="relative border rounded-md p-5 mt-4">
				<EditButton />

				{/* Settings */}
				<div className="flex flex-col gap-2">
					<div>
						<Label>Name</Label>
						<div className="text-sm font-accent">Jake</div>
          </div>
          
					<div>
						<Label>Email</Label>
						<div className="text-sm font-accent">jakeservin@gmail.com</div>
					</div>
				</div>
			</div>
		</div>
  );
}

export default AccountSettings