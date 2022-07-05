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

// From Matthias Hagemann's "The Ultimate Way to Slugify a URL String in Javascript"
// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
export function slugify(string) {
    const a =
        "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;"
    const b =
        "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------"
    const p = new RegExp(a.split("").join("|"), "g")

    return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, "-and-") // Replace & with 'and'
        .replace(/[^\w-]+/g, "") // Remove all non-word characters
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
}