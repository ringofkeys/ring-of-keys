import React from "react"
import "./menuicon.css"

const MenuIcon = ({ onClick, className }) => {
  function handleClick(e) {
    onClick(e)

    if (e.target.classList.contains("menu-icon__hamburger")) {
      e.target.parentElement.classList.toggle("active")
    } else {
      e.target.classList.toggle("active")
    }
  }

  return (
    <button className={`menu-icon ${className}`} onClick={handleClick}>
      <span className="menu-icon__hamburger"></span>
    </button>
  )
}
export default MenuIcon
