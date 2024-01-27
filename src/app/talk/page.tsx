import Chat from "@/features/chat/Chat";
import React from "react";

const Talk = ({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	return (
		<div>
			<Chat searchParams={searchParams} />
		</div>
	);
};

export default Talk;
