"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";

const page = () => {
	const supabase = createClientComponentClient();

	useEffect(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				window.close();
			}
		});
	}, []);

	return <></>;
};

export default page;
