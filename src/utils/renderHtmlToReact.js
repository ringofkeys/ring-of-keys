import React from "react";
import hastToHyperscript from "hast-to-hyperscript";

export const renderHtmlToReact = node => {
  const hs = hastToHyperscript(React.createElement, checkATags(node));

  console.log('parsing html', node, hs)

  return hs
}

function linkIsExternal(url) {
  return !url.startsWith('#') && !(url.includes('ringofkeys') || url.includes('localhost'))
}

function checkATags(node) {
  if (node.children) {
    node.children = node.children.map(checkATags)
  }

  if (node.tagName === 'a' && node.properties.href && linkIsExternal(node.properties.href)) {
    node.properties = {
      ...node.properties,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  return node
}