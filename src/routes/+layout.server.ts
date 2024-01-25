import { datoClient } from "$lib/datocms";

const NAV_MENU_ID = '70794454'

export async function load() {
    const navData = await datoClient.items.find(NAV_MENU_ID, {
        nested: true,
    })

    console.log(navData)

	return {
		navData
	};
}