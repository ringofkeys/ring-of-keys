import test, { expect, Page } from "@playwright/test"
import { brokenProfileUser } from "./test-helpers"

test.describe("profile view with various profiles", () => {
    async function replaceUserWithBrokenOne(page: Page) {
        await page.route("https://graphql.datocms.com/preview", async (route, request) => {
            const json = await request.postDataJSON()
            
            console.log('new GraphQL request', json)
            if ('query' in json && typeof json.query === 'string' && json.query.includes('KeyQuery')) {
                json.data.key = brokenProfileUser
                await route.fulfill({ status: 200, body: JSON.stringify(json) })
            }
            await route.continue()
        })
    }
    test("happy path, no changes", async ({ page }) => {
        const editProfileLink = page.getByRole("link", { name: "Edit public profile" })
        const myStoryHeading = page.getByRole("heading", { name: "My Story" })
        
        // We're already authenticated in the setup
        await page.goto("/dashboard")
        await editProfileLink.click()

        await expect(myStoryHeading).toBeVisible()
    })
    
    test("replace test profile with a known broken one", async ({ page }) => {
        const editProfileLink = page.getByRole("link", { name: "Edit public profile" })
        const myStoryHeading = page.getByRole("heading", { name: "My Story" })
        
        await replaceUserWithBrokenOne(page)

        // We're already authenticated in the setup
        await page.goto("/dashboard")
        await editProfileLink.click()

        await expect(myStoryHeading).toBeVisible()
    })
})