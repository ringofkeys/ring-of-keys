import { useState, useRef, useEffect } from "react"

export const useIntersect = ({ root = null, rootMargin, threshold = 0 }) => {
  const [entry, updateEntry] = useState({})
  const [node, setNode] = useState(null)

  const observer = useRef(
    new window.IntersectionObserver(
      ([entry]) => {
        // console.log('observed!', entry)
        updateEntry(entry)
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )
  )

  useEffect(() => {
    const { current: currentObserver } = observer
    currentObserver.disconnect()

    if (node) currentObserver.observe(node)
    // console.log('now observing node =', node)
    return () => currentObserver.disconnect()
  }, [node])

  return [setNode, entry]
}
