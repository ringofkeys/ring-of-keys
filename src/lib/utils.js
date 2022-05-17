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

/**
 * Converts camelCase, Sentence case, or PascalCase to kebab-case
 * from GeeksForGeeks: https://www.geeksforgeeks.org/how-to-convert-a-string-into-kebab-case-using-javascript/
 * @param {string} str 
 * @returns {string}
 */
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}