import React from "react";
import hastToHyperscript from "hast-to-hyperscript";

export const renderHtmlToReact = node => {
  return hastToHyperscript(React.createElement, node);
}