import Fuse from 'fuse.js'

export function prepareMemberList(memberList) {
    let t = [...memberList]
    t = t.filter(artist => artist.showInDirectory)
    
    // add firstName and lastName props by splitting name at first ' '
    t.forEach((artist) => {
        artist.firstName = artist.name.substr(0, artist.name.indexOf(" "))
        artist.lastName = artist.name.substr(
            artist.name.indexOf(" ") + 1,
            artist.name.length
        )
    })

    return t
}

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
        threshold: .3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
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
    return searchList.sort((a, b) => {
        const filterName = name => name.trim()
            .toLowerCase()
            .replace(/[\-\!\.]|(\(.+\))/gi, "")
            .split(" ")
            .filter(a => a)
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


/**
 * A getter for all of the configuration of directory filters
 * to build out the directory search filter UI,
 * complete with Fuse.js weights and logic parameters.
 * @returns DirectoryFilter[]
 */
function getDirectoryFilters() {
    return [
      {
        field: "firstName",
        label: "First Name",
        placeholder: "First Name",
        type: "text",
        logic: "or",
      },
      {
        field: "lastName",
        label: "Last Name",
        placeholder: "Last Name",
        type: "text",
        logic: "or",
      },
      {
        field: "discipline",
        label: "Discipline",
        placeholder: "ie: Actor, Stage Manager, Music Director",
        type: "text",
        logic: "or",
      },
      {
        field: "vocalRange",
        label: "Vocal Range",
        placeholder: "ie: Soprano, Tenor",
        type: "fuzzy",
        threshold: 0.25,
        logic: "and",
      },
      {
        field: "danceExperience",
        label: "Dance Experience",
        placeholder: "ie: Ballet, Tap, Jazz",
        type: "fuzzy",
        threshold: 0.25,
        logic: "and",
      },
      {
        field: "pronouns",
        label: "Pronouns",
        placeholder: "ie: They / Them or She / Her",
        type: "fuzzy",
        threshold: 0.25,
        logic: "and",
        helpText: `When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else).`,
      },
      {
        field: "genderIdentity",
        label: "Gender Identity",
        placeholder: "ie: Non-Binary, Cis, Gender Fluid",
        type: "fuzzy",
        threshold: 0.38,
        logic: "and",
        helpText: `One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others.`,
      },
      {
        field: "sexualIdentity",
        label: "Sexual Orientation",
        placeholder: "ie: Bisexual, Queer, Lesbian",
        type: "fuzzy",
        threshold: 0.3,
        logic: "and",
        helpText: `Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person.`,
      },
      {
        field: "raceEthnicity",
        label: "Race / Ethnicity",
        placeholder: "ie: Black, Indigenous, Latinx, etc.",
        type: "fuzzy",
        threshold: 0.3,
        logic: "and",
        helpText: `Racial identity is the qualitative meaning one ascribes to one’s racial group, whereas ethnic identity is a concept that refers to one’s sense of self as a member of an ethnic group. At their core, both constructs reflect an individual’s sense of self as a member of a group; however, racial identity integrates the impact of race and related factors, while ethnic identity is focused on ethnic and cultural factors. We celebrate our Keys’ intersectionality and understand that creating one’s racial/ethnic identity is a fluid and nonlinear process that varies for every person. Many folks will identify with more than one background while others will identify with a single group more broadly.`,
      },
      {
        field: "locations",
        label: "Region",
        helpText: "(check as many that apply)",
        type: "checkbox",
        values: [
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
        ],
        logic: "and",
      },
      {
        field: "affiliations",
        label: "Unions & Affiliations",
        helpText: "(check as many that apply)",
        type: "checkbox",
        values: [
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
        ],
        logic: "and",
      },
    ]
  }