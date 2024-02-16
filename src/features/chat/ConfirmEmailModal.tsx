import { AlertDialog, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import React, { Dispatch, SetStateAction } from 'react'
import { Button } from 'react-day-picker';

const ConfirmEmailModal = ({confirmEmailModal, setConfirmEmailModal}: {
	confirmEmailModal: boolean;
	setConfirmEmailModal: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<AlertDialog
			open={confirmEmailModal}
			onOpenChange={() => setConfirmEmailModal(false)}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Account successfully created!
					</AlertDialogTitle>
					<AlertDialogDescription>
						In order to save your conversation history, keep this
						tab open and sign in after clicking the link in your
						email.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction>
						<Button>Continue</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ConfirmEmailModal