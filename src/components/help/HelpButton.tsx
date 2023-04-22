import React, {useState} from "react";
import {Theme} from 'src/App'
import './HelpButton.scss'
import { HelpPopover } from "./HelpPopover";

interface Props {
  theme: Theme
}

export const HelpButton: React.FC<Props> = ({theme}) => {
  const [hoveringHelp, setHoveringHelp] = useState(false);
  const hoverHelpOn = () => {
    setHoveringHelp(true);
  };

  const hoverHelpOff = () => {
    setHoveringHelp(false);
  };
  return (
    <div className="help-container">
      <HelpPopover hoveringHelp={hoveringHelp}/>
      
      <div
        className={theme == "dark" ? "help-button-dark" : "help-button"}
        onMouseEnter={hoverHelpOn}
        onMouseLeave={hoverHelpOff}
      >
        ?
      </div>
    </div>
  );
};
