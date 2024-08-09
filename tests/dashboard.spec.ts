import test, { expect, Page } from "@playwright/test"
import { DashboardContent, DashboardUserData } from "pages/dashboard"

test.describe("dashboard with various profiles", () => {
    async function removeProfileDataField(page: Page, fieldName: keyof DashboardUserData) {
        await page.route("https://graphql.datocms.com/preview", async (route) => {
            const response = await route.fetch()
            const json = (await response.json()) as { data: DashboardContent}
            const modifiedJson = structuredClone(json)

            if (modifiedJson.data.user?.[fieldName]) {
                delete modifiedJson.data.user?.[fieldName]
            }

            console.log('unmodified json', JSON.stringify(json, null, 2))
            console.log('modifiedJson', modifiedJson.data.user)
            
            // Remove the field from the response
            await route.fulfill({ response, json: modifiedJson })
        })
    }
    test("happy path, no changes", async ({ page }) => {
        // We're already authenticated in the setup
        await page.goto("/dashboard")
        await expect(
            page.getByRole("link", { name: "My Account" })
        ).toBeVisible()
    })

    const keysToTest: (keyof DashboardUserData)[] = [
        "pronouns",
        'memberSince',
        'stripeId',
        'name',
        'headshot',
        'hideMessageButton',
        'moderateMessages',
        'slug',
        'keyTeamMember',
        'id',
    ]

    keysToTest.forEach((key) => {
        test(`missing ${key}`, async ({ page }) => {
            await removeProfileDataField(page, key)
            await page.goto("/dashboard")

            // Verify that the page loads at least without a big client-side error
            await expect(
                page.getByRole("link", { name: "My Account" })
            ).toBeVisible()

            // Now what to do here?
        })
    })
})
