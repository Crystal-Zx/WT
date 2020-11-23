import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => (
  <div>
    <div>
      <NavLink exact to="/">Home</NavLink>
      <NavLink to="/settings">Settings</NavLink>
    </div>
  </div>
)

export default NavBar