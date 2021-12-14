export const decodeHtmlEntity = function(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec)
  })
}
