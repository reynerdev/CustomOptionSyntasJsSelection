import React from "react";
import Refractor from "react-refractor";
import js from "refractor/lang/javascript";
import "./prism.css";

// import SyntaxHighlighter from "react-syntax-highlighter";
// import SyntaxHighlighter, {
//   registerLanguage,
// } from 'react-syntax-highlighter/prism-light';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import SyntaxHighlighter from 'react-syntax-highlighter'
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import style from "react-syntax-highlighter/dist/esm/styles/prism";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
// SyntaxHighlighter.rdegisterLanguage('javascript', javascript, ['js'])

import { theme } from "./theme";

let path = "";
let selected = false;
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
    document.addEventListener("keydown", (event) => {
      // console.log("document.event");
      console.log(event.keyCode);
      // let e = new Event("keydown");
      // console.log(wrapperRef.current);
      // wrapperRef.current.dispatchEvent(e);
    });
  }, []);

  const onMouseDown = React.useCallback((event) => {
    // console.log("event", event.target.className);
    // console.log("event", event.target.className.includes(""));
    // console.log("event", event.target.className.split(" ")[0] === "");
    // console.log("event", event.target.className.split(" ")[0]);
    // console.log("event", event.target.className.split(" ")[0]);

    // event.target.set(0, 2);

    // let range = new Range();
    // range.selectNodeContents(event.target);

    // range.setStart(event.target, 0);
    // range.setEnd(event.target.firstChild, 2);

    // // apply the selection, explained later below

    const isEditable =
      !event.target.className.includes("property") &&
      !event.target.className.includes("string-property") &&
      !event.target.className.includes("punctuation") &&
      !event.target.className.includes("operator") &&
      !event.target.className.includes("linenumber") &&
      !event.target.className.includes("prismjs"); //&&
    // !event.target.className.split(" ")[0] === "";
    if (isEditable) {
      event.target.setAttribute("contentEditable", true);
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
      // console.log("setvalue");
      let val = event.target.innerText;
      getPath(event.target);
      setValue({ ...{ path: path, value: val } });
      path = "";
    }
  }, []);

  const onKeyDown = React.useCallback((event) => {
    // event.preventDefault();
    event.stopPropagation();
    // console.log("getSelection", document.getSelection());
    // window.getSelection().removeAllRanges();
    console.log("keycode", event.key);
    if (event.key === "ArrowDown") {
      // change this targe to editable false, remove focus
      event.target.setAttribute("contentEditable", false);
      movefocus(event.target, "down");
    }

    if (event.key === "ArrowUp") {
      // change this targe to editable false, remove focus
      event.target.setAttribute("contentEditable", false);
      movefocus(event.target, "up");
    }
    // event.target.setAttribute("contentEditable", true);
  }, []);

  console.log(value);
  const onSelect = (event) => {
    // event.nativeEvent.stopImmediatePropagation();
    // console.log("onSelectEvent");
  };

  return (
    <div
      className="App"
      onKeyUp={onKeyUp}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      onSelect={onSelect}
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
    </div>
  );
}
const movefocus = (t, direction) => {
  console.log("t", t);
  let first = true;

  // reference to the last editable
  // help to reaching the end
  let refLastFocus = t;

  const recursiveSearchUp = (target) => {
    console.log("target", target, first);
    if (target.previousSibling === null) {
      // in case reach the end of the object , to avoid scrollin  of
      // the content
      // refLastFocus.setAttribute("contentEditable", true);
      // refLastFocus.focus();
      // addSelection()
      setTimeout(() => addSelection(refLastFocus), 50);

      first = false;
      return;
    }

    if (
      (target.className.split(" ").includes("string") ||
        target.className.split(" ").includes("number")) &&
      !first
    ) {
      refLastFocus = target;
      // console.log("finished", target.innerText);
      // target.setAttribute("contentEditable", true);
      // target.focus();
      setTimeout(() => addSelection(target), 50);
      first = false;
      return;
    }
    first = false;

    recursiveSearchUp(target.previousSibling);
  };

  const recursiveSearchDown = (target) => {
    console.log("target", target, first);
    if (target.nextSibling === null) {
      refLastFocus.setAttribute("contentEditable", true);
      refLastFocus.focus();
      first = false;
      return;
    }
    if (
      (target.className.split(" ").includes("string") ||
        target.className.split(" ").includes("number")) &&
      !first
    ) {
      refLastFocus = target;
      // target.setAttribute("contentEditable", true);
      // target.focus();
      // target.focus();
      setTimeout(() => addSelection(target), 50);
      // addSelection(target);
      // target.focus();
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
  const selection = window.getSelection();
  // console.log("target add Selection", target);
  // console.log("nodeType target", target.nodeType);
  // console.log("nodeType firstChild", target.firstChild);
  // console.log("childnodes", target.childNodes);

  target.setAttribute("contentEditable", true);
  target.focus();

  let range = new Range();
  range.setStart(target.childNodes[0], 0);
  range.setEnd(target.childNodes[0], 1);
  range.selectNodeContents(target.childNodes[0]);
  selection.removeAllRanges();
  window.getSelection().addRange(range);

  // range.selectNodeContents(rarget.childNodes[0]);
  // document.getSelection().removeAllRanges();
  // document.getSelection().addRange(range);
};
