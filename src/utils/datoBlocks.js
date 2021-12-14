import { parse } from "html-react-parser"

export function parseBlock(blockContent) {
  // console.log({ blockContent })
  const parsed = parse(blockContent)
  // console.log({ parsed })
  return parsed
}
