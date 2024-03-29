import React, { useState, useEffect, useRef } from "react";
import { rootFolder, Folder } from "./FolderStructure";
import { ThemeToggler } from "./components/theme-toggler/ThemeToggler";
import "./App.scss";
import { TerminalButtons } from "./components/terminal-buttons/TerminalButtons";
import { HelpButton } from "./components/help/HelpButton";

enum KeyCodes {
  UP = 38,
  DOWN = 40,
  TAB = 9,
}

type InputEl = HTMLInputElement | null;
type DivEl = HTMLDivElement | null;
export type Theme = "dark" | 'light'

const App: React.FunctionComponent = () => {
  const [userInput, setUserInput] = useState("");
  const [currStack, setCurrStack] = useState([rootFolder]);
  const [history, setHistory] = useState<
    Array<{
      stack: Array<Folder>;
      userInput: string;
      output: string | null;
      cleared: boolean;
    }>
  >([]);
  const [userInputHidden, setUserInputHidden] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(history.length - 1);
  const inputEl = useRef<InputEl>(null);
  const terminalEl = useRef<DivEl>(null);
  const scrollableHistoryEl = useRef<DivEl>(null);
  const currFolder = currStack[currStack.length - 1];
  const isInputSticky = useRef<boolean>(false);
  const [autocompleteArr, setAutocompleteArr] = useState<Array<string>>([]);
  // funtion used to get initial theme on component mount
  let getInitialTheme: () => "dark" | "light" = () => {
    let stored = localStorage.getItem("theme");
    if (stored == "light" || stored == "dark") {
      return stored;
    } else {
      return "light";
    }
  };
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  if (scrollableHistoryEl.current) {
    scrollableHistoryEl.current.scrollTop =
      scrollableHistoryEl.current.scrollHeight;
  }

  useEffect(() => {
    setUserInput("");
    setScrollIndex(history.length - 1);
  }, [history]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (terminalEl.current && scrollableHistoryEl.current) {
    if (
      scrollableHistoryEl.current.scrollHeight >
      terminalEl.current.clientHeight - 30
    ) {
      isInputSticky.current = true;
    }
  }

  const addNewHistoryItem = (output: string | null) => {
    setHistory([
      ...history,
      {
        stack: currStack,
        userInput: userInput,
        output: output,
        cleared: false,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const indentation = "\xa0\xa0\xa0"
    const [command, ...args] = userInput.split(" ");
    if (command == "cd") {
      cd(args[0]);
      return;
    }
    if (command == "ls") {
      let lsOutput = currFolder.children
        .map((el) => {
          if (el.type == "folder") {
            return `<b>${el.name}</b>`;
          } else {
            return el.name;
          }
        })
        .join(indentation);
      addNewHistoryItem(lsOutput);
      return;
    }
    if (command == "clear") {
      isInputSticky.current = false;
      addNewHistoryItem(null);
      let clearedHistory = history.map((item) => ({ ...item, cleared: true }));
      setHistory(clearedHistory);
      return;
    }
    let validFile = currFolder.children.find(
      (child) => child.name == userInput
    );
    if (validFile) {
      if (validFile.type == "file") {
        addNewHistoryItem(validFile.value);
      } else if (validFile.type == "link") {
        let link = validFile.link;
        console.log("link", link);
        console.log(validFile.name);
        addNewHistoryItem(`Opening Nicole's ${validFile.name} in a new tab...`);
        setUserInputHidden(true);
        setTimeout(() => {
          window.open(link, "_blank");
          setUserInputHidden(false);
        }, 1000);
      }
      return;
    }
    addNewHistoryItem("Command not found");
  };

  const focusOnInputEl = () => {
    if (inputEl.current !== null) {
      inputEl.current.focus();
    }
  };

  const childrenNames = currFolder.children.map((el) => el.name);
  const childrenFolders = currFolder.children
    .filter((child) => child.type == "folder")
    .map((el) => el.name);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);

    if (e.target.value.includes(" ")) {
      const [command, ...args] = e.target.value.split(" ");
      if (command == "cd") {
        let folderRecs = childrenFolders.filter((el) => {
          return el.includes(args[0]);
        });
        setAutocompleteArr(folderRecs);
      }
    } else {
      let fileRecs = childrenNames.filter((el) => {
        return el.includes(e.target.value);
      });
      setAutocompleteArr(fileRecs);
    }
  };

  const checkUserTab = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const [command, ...args] = userInput.split(" ");
    if (e.keyCode == KeyCodes.TAB && autocompleteArr.length > 0) {
      if (command == "cd") {
        setUserInput(`cd ${autocompleteArr[0]}`);
      } else {
        setUserInput(autocompleteArr[0]);
      }
    }
  };

  // checks if user is scrolling through history, or if user pressed tab for autocomplete
  const checkUserScrollAndTab = (e: React.KeyboardEvent<HTMLInputElement>) => {
    checkUserTab(e);
    if (e.keyCode == KeyCodes.UP && scrollIndex > -1) {
      setUserInput(history[scrollIndex].userInput);
      if (scrollIndex <= 0) {
        setScrollIndex(0);
      } else {
        setScrollIndex(scrollIndex - 1);
      }
      return;
    }
    if (e.keyCode == KeyCodes.DOWN && scrollIndex < history.length) {
      if (userInput) {
        setUserInput(history[scrollIndex].userInput);
      }
      if (scrollIndex >= history.length - 1) {
        setScrollIndex(history.length - 1);
      } else {
        setScrollIndex(scrollIndex + 1);
      }
    }
  };

  const cd = (folderName: string) => {
    if (folderName == "..") {
      if (currStack.length <= 1) {
        addNewHistoryItem("No parent directory exists");
        return;
      }
      addNewHistoryItem(null);
      let newCurrStack = [...currStack];
      newCurrStack.splice(newCurrStack.length - 1, 1);
      setCurrStack(newCurrStack);
    } else {
      let folder = currFolder.children.find((child) => {
        return child.name == folderName;
      });
      if (!folder || folder.type !== "folder") {
        addNewHistoryItem("No directory found: " + folderName);
        return;
      }
      setCurrStack([...currStack, folder]);
      let folderOutput = folder.children
        .map((el) => el.name)
        .join("\xa0\xa0\xa0");
      addNewHistoryItem(folderOutput);
    }
  };

  // formats the path for the current input and all history items. prevents the root (first item) from displating in the stack path
  const renderPath = (stack: Array<Folder>) =>
    stack
      .slice(1)
      .map((f) => f.name)
      .join("/");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else setTheme("light");
  };

  return (
    <div className={theme == "dark" ? "App-dark" : "App"}>
      <div className="toggle-theme-container">
        {ThemeToggler(theme, toggleTheme)}
      </div>
      <div className="terminal-wrapper">
        <div
          className={theme == "dark" ? "terminal-dark" : "terminal"}
          onClick={focusOnInputEl}
          ref={terminalEl}
        >
          <div className="terminal-header">
            <TerminalButtons />
            <div className="terminal-header-title">Nicole's Terminal</div>
          </div>
          <div className="content-wrapper" ref={scrollableHistoryEl}>
            <div
              className={`terminal-content ${
                isInputSticky.current ? "sticky" : ""
              }`}
            >
              {history
                .filter((item) => item.cleared == false)
                .map((item) => (
                  <div className="history-item">
                    <div className="history-input">
                      <div>
                        <div className="stack">
                          ~
                          {item.stack.length <= 1
                            ? ""
                            : "/" + renderPath(item.stack)}
                          $
                        </div>{" "}
                        {item.userInput}
                      </div>
                    </div>
                    {item.output && 
                      <div
                        className="history-output"
                        dangerouslySetInnerHTML={{ __html: item.output }}
                      />
                    }
                  </div>
                ))}
              <form
                hidden={userInputHidden}
                onSubmit={handleSubmit}
                className="input-form"
              >
                <div className="stack">
                  ~{currStack.length <= 1 ? "" : "/" + renderPath(currStack)}$
                </div>
                <input
                  ref={inputEl}
                  autoFocus
                  className="user-input"
                  onChange={handleInputChange}
                  onKeyDown={checkUserScrollAndTab}
                  value={userInput}
                />
              </form>
            </div>
            <div />
          </div>
        </div>
      </div>
      <HelpButton theme={theme} />
    </div>
  );
};

export default App;
