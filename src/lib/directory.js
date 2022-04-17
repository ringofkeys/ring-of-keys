import Fuse from "fuse.js"

export function prepareMemberList(memberList) {
  let t = [...memberList]
  t = t.filter((artist) => artist.showInDirectory)

  // add firstName and lastName props by splitting name at first ' '
  t.forEach((artist) => {
    const trimmedName = artist.name.trim()
    const lastSpaceIndex = trimmedName.lastIndexOf(" ")
    artist.firstName =
      lastSpaceIndex > 0
        ? trimmedName.substr(0, trimmedName.lastIndexOf(" "))
        : trimmedName
    artist.lastName =
      lastSpaceIndex > 0
        ? trimmedName.substr(
            trimmedName.lastIndexOf(" ") + 1,
            trimmedName.length
          )
        : ""
  })

  return t
}

export const locations = [
  "New York City",
  "Chicago",
  "Los Angeles",
  "Philadelphia",
  "San Francisco / Oakland",
  "Minneapolis / St. Paul",
  "Denver",
  "Boulder",
  "Orlando",
  "Sarasota",
  "Louisville",
  "Baltimore",
  "Boston",
  "St. Louis",
  "Las Vegas",
  "Raleigh",
  "Cleveland",
  "Ashland",
  "Portland, OR",
  "Pittsburgh",
  "Austin",
  "Salt Lake City",
  "Washington, D.C.",
  "Seattle",
  "Toronto",
  "Ontario",
  "London",
]

export const affiliations = [
  "AEA",
  "AFM",
  "AGMA",
  "AGVA",
  "ASCAP",
  "BMI",
  "CSA",
  "EMC",
  "IATSE",
  "LMDA",
  "SAFD",
  "SAG/AFTRA",
  "SDC",
  "USA",
  "Non-union",
]

/**
 * get a fuzzy search class, currently using Fuse.js,
 * to power text-based search given a list to search over
 * and the keys to search on.
 * @param {MemberObject[]} searchableList
 * @param {string[]} searchKeysList
 * @returns Fuse
 */
export function getDirectorySearch(searchableList, searchKeysList) {
  return new Fuse(searchableList, {
    keys: searchKeysList,
    includeScore: true,
    shouldSort: true,
    includeMatches: true,
    threshold: 0.25,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
  })
}

/**
 * Sorts an array of objects representing RoK members by their names
 * Lots of members have unconventional spelling and characters in their names,
 * so it requires a bit more finesse than normal sorting
 * @param {MemberObject[]} memberList
 * @returns MemberObject[]
 */
export function sortMembersByName(memberList) {
  return memberList.sort((a, b) => {
    const filterName = (name) =>
      name
        .trim()
        .toLowerCase()
        .replace(/[\-\!\.]|(\(.+\))/gi, "")
        .split(" ")
        .filter((a) => a)
    const aNameToken = filterName(a.node.name)
    const bNameToken = filterName(b.node.name)

    if (aNameToken[aNameToken.length - 1] < bNameToken[bNameToken.length - 1]) {
      return -1
    }
    if (aNameToken[aNameToken.length - 1] > bNameToken[bNameToken.length - 1]) {
      return 1
    }
    return 0
  })
}
