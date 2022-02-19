import React from 'react'
import Icon from "components/Icon"

const socialLinkData = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/RingofKeysOrg/",
      icon: (className) => <Icon type="facebook" className={className} />,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/ringofkeysorg/",
      icon: (className) => <Icon type="instagram" className={className} />,
    },
    {
      label: "Twitter",
      href: "https://twitter.com/ringofkeysorg",
      icon: (className) => <Icon type="twitter" className={className} />,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCwrpjtLgs1K7A8bHxScfoGg",
      icon: (className) => <Icon type="youtube" className={className} />,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/ring-of-keys/about/",
      icon: (className) => <Icon type="linkedin" className={className} />,
    },
]

export default socialLinkData