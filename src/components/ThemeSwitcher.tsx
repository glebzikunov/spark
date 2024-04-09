"use client"

import React from "react"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"

const ThemeSwitcher = () => {
  return (
    <div className="p-2 flex items-center space-x-2 cursor-pointer">
      <Label className="font-normal" htmlFor="theme-mode">
        Dark mode
      </Label>
      <Switch id="theme-mode" />
    </div>
  )
}

export default ThemeSwitcher
