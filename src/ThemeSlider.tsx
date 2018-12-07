import React from 'react'
import './ThemeSlider.scss'

export const ThemeSlider = (theme: 'dark' | 'light', toggleTheme: () => void) => {
  return <>
      <div className={`theme-option-${theme}`}>light</div>
        <input className="slider-container" type="checkbox" id="switch" checked={theme === 'dark'}/>
        <label className={`slider-${theme}`} htmlFor="switch" onClick={toggleTheme} />
        <div className={`theme-option-${theme}`}>dark</div>
      </>
}