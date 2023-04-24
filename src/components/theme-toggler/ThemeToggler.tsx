import React from 'react'
import { DarkThemeIcon } from './DarkThemeIcon'
import { LightThemeIcon } from './LightThemeIcon'
import './ThemeToggler.scss'
import {Theme} from 'App'

export const ThemeToggler = (theme: Theme, toggleTheme: () => void) => (
  <div className='toggle-theme'>
    <div><LightThemeIcon theme={theme} /></div>
    <input className="checkbox" type="checkbox" id="switch" checked={theme === 'dark'}/>
    <label className={`slider-${theme}`} htmlFor="switch" onClick={toggleTheme} />
    <div><DarkThemeIcon theme={theme} /></div>
  </div>
)