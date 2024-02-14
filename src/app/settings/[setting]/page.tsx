import Settings from "@/features/settings/Settings";
import React from "react";

const page = ({ params }: { params: { setting: string } }) => {

	return (
		<div>
			<Settings params={params} />
		</div>
	);
};

export default page;
