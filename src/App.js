import React from "react";
import Refractor from "react-refractor";
import js from "refractor/lang/javascript";
import "./prism.css";
import "./utils.css";
import { insertColorElement, removeColorElement } from "./utils";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import style from "react-syntax-highlighter/dist/esm/styles/prism";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { theme } from "./theme";

let path = "";

export const TestContext = React.createContext("");

const getPath = (target) => {
  if (target.previousSibling === null) {
    console.log("finalPath", path);
    return;
  } else {
    if (target.className.includes("string-property")) {
      if (path === "") {
        path = target.innerText;
      } else {
        path = target.innerText + "." + path;
      }
    }
    getPath(target.previousSibling);
  }
};

export default function App() {
  // const [path, setPath] = React.useState("");
  const [value, setValue] = React.useState({ path: "", value: "" });
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    // wrapperRef.current.querySelector('#')
  }, []);

  const onMouseDown = React.useCallback((event) => {
    console.log("event", event.target);
    console.log(
      "inline-color",
      event.target.className.split(" ").includes("inline-color")
    );
    if (event.target.className.split(" ").includes("inline-color")) {
      return;
    }

    const isEditable =
      !event.target.className.includes("property") &&
      !event.target.className.includes("string-property") &&
      !event.target.className.includes("punctuation") &&
      !event.target.className.includes("operator") &&
      !event.target.className.includes("linenumber") &&
      !event.target.className.includes("prismjs") &&
      !event.target.className.includes("inline-color-wrapper");
    if (isEditable) {
      event.target.setAttribute("contentEditable", true);
      console.log("innertText", event.target.innerText);
      insertColorElement(event.target);
    }
  }, []);

  const onKeyUp = React.useCallback((event) => {
    event.stopPropagation();
    if (event.key === "ArrowDown" || event.key === "ArrowUp") return;
    if (
      !event.target.className.includes("property") &&
      !event.target.className.includes("punctuation") &&
      !event.target.className.includes("operator")
    ) {
      let val = event.target.innerText;
      getPath(event.target);
      setValue({ ...{ path: path, value: val } });
      path = "";
    }
  }, []);

  const onKeyDown = React.useCallback((event) => {
    event.stopPropagation();
    console.log("keycode", event.key);
    if (event.key === "ArrowDown") {
      // this condition is to delete the input color in case of moving down or up
      if (!event.target.className.split(" ").includes("inline-color-wrapper")) {
        removeColorElement(event.target);
      }
      event.target.setAttribute("contentEditable", false);
      movefocus(event.target, "down");
    }

    if (event.key === "ArrowUp") {
      // change this targe to editable false, remove focus
      if (!event.target.className.split(" ").includes("inline-color-wrapper")) {
        removeColorElement(event.target);
      }
      event.target.setAttribute("contentEditable", false);
      movefocus(event.target, "up");
    }
  }, []);

  console.log(value);

  const onBlur = React.useCallback((event) => {
    // remove if it not the input
    // if (!event.target.className.split("").includes("inline-color-wrapper")) {
    //   removeColorElement(event);
    // }
  }, []);

  const [testValue, setTestValue] = React.useState(0);
  const val = { testValue, setTestValue };

  return (
    <TestContext.Provider value={testValue}>
      <div
        id="containerCode"
        className="App"
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        ref={wrapperRef}
        tabIndex={0}
      >
        <SyntaxHighlighter
          language="javascript"
          useInlineStyles={false}
          // style={vscDarkPlus}
          // style={dracula}
          showLineNumbers
        >
          {JSON.stringify(theme, 0, 2)}
        </SyntaxHighlighter>
        {/* <Refractor language="js" value={JSON.stringify(theme, 0, 2)} /> */}
        {testValue}
      </div>
    </TestContext.Provider>
  );
}
const movefocus = (t, direction) => {
  let first = true;
  // reference to the last editable input
  let refLastFocus = t;

  const recursiveSearchUp = (target) => {
    if (target.previousSibling === null) {
      // in case reach the end of the object , to avoid scrolling  off
      // the content
      insertColorElement(refLastFocus);
      addSelection(refLastFocus);

      first = false;
      return;
    }

    if (
      (target.className.split(" ").includes("string") ||
        target.className.split(" ").includes("number")) &&
      !first
    ) {
      refLastFocus = target;
      insertColorElement(target);
      addSelection(target);
      first = false;
      return;
    }
    first = false;

    recursiveSearchUp(target.previousSibling);
  };

  const recursiveSearchDown = (target) => {
    if (target.nextSibling === null) {
      insertColorElement(refLastFocus);
      addSelection(refLastFocus);
      first = false;
      return;
    }
    if (
      (target.className.split(" ").includes("string") ||
        target.className.split(" ").includes("number")) &&
      !first
    ) {
      refLastFocus = target;
      insertColorElement(target);
      addSelection(target);
      first = false;
      return;
    }
    first = false;
    recursiveSearchDown(target.nextSibling);
  };

  if (direction === "up") {
    recursiveSearchUp(t);
  }

  if (direction === "down") {
    recursiveSearchDown(t);
  }
};

const addSelection = (target) => {
  setTimeout(() => {
    const selection = window.getSelection();
    target.setAttribute("contentEditable", true);
    target.focus();

    let range = new Range();
    range.setStart(target.childNodes[0], 0);
    range.setEnd(target.childNodes[0], 1);
    range.selectNodeContents(target.childNodes[0]);
    selection.removeAllRanges();
    window.getSelection().addRange(range);
  }, 50);
};
