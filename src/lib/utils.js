/**
 * Converts a camelCaseString into a Title Case String
 * from StackOverflow: https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-title-case-text
 * @param {string} camelCase 
 * @returns {string}
 */
export function camelCaseToLabel(camelCase) {
    const withSpaces = camelCase.replace(/([A-Z])/g, " $1")
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}