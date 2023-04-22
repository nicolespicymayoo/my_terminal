import React from "react";

interface Props {
  hoveringHelp: boolean;
}

export const HelpPopover: React.FC<Props> = ({ hoveringHelp }) => (
  <div className={hoveringHelp ? "help-content" : "help-content-hidden"}>
    <div className="help-title">Need help?</div>
    <ul>
      <li className="help-text">
        <div className="help-text-bullet">{"\u2022 "}</div>
        <div>
          Type '<span className="monospace">ls</span>' to see files
        </div>
      </li>
      <li className="help-text">
        <div className="help-text-bullet">{"\u2022 "}</div>
        <div>
          Items in <b> bold </b> are folders
        </div>
      </li>
      <li className="help-text">
        <div className="help-text-bullet">{"\u2022 "}</div>
        <div>
          Type '
          <span className="monospace">
            cd <i>file_name</i>
          </span>{" "}
          ' to see folder contents
        </div>
      </li>
      <li className="help-text">
        <div className="help-text-bullet">{"\u2022 "}</div>Type 'clear' to clear
        history
      </li>
    </ul>
  </div>
);
