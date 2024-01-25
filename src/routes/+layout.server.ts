import { request } from "$lib/datocms";
import { NavDocument } from "$lib/generatedGraphQLTypes";


export async function load() {
    const navData = await request({ document: NavDocument})

	return {
		navData
	};
}