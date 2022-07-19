import React from "react";
import Refractor from "react-refractor";
import js from "refractor/lang/javascript";
import "./prism.css";
import "./utils.css";
import { insertColorElement, removeColorElement } from "./utils";
import IMask from "imask";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import style from "react-syntax-highlighter/dist/esm/styles/prism";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { theme } from "./theme";

let path = "";

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
    const inputColor = document.getElementById("inputColor");
    document.addEventListener("change", (event) => {
      event.stopPropagation();
      //only when the input color is changed
      if (event.target.getAttribute("id") === "inputColor") {
        const spanColorContent = document.getElementById("currentEditing");
        const inputColor = document.getElementById("inputColor");
        spanColorContent.innerText = event.target.value;
        insertColorElement(spanColorContent);
        getPath(spanColorContent);
        setValue({ ...{ path: path, value: event.target.value } });
        path = "";
      }
      // inputColor.focus();
    });
  }, []);

  const onMouseDown = React.useCallback((event) => {
    event.stopPropagation();
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
      // event.target.setAttribute("contentEditable", true);
      console.log("mouseDown", event.target);

      // avoid doble click if its already selected
      console.log("document actyive lement", document.activeElement);
      // console.log(document.activeElement.isEqualNode(event.target));
      if (document.activeElement !== event.target) {
        console.log("inside comparasion");
        // event.target.setAttribute("contentEditable", true);
        // if (document.activeElement.isEqualNode(event.target)) {
        insertColorElement(event.target);
      }
      // event.target.setAttribute("contentEditable", true);
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
      // val = val.replaceAll('"', "");
      // var patternMask = IMask.createMask({
      //   mask: "{#}******"
      // });
      // const resolvedMask = patternMask.resolve(val);
      // console.log("resolvedMask", resolvedMask);
      // event.target.innerText = resolvedMask;

      getPath(event.target);
      setValue({ ...{ path: path, value: val } });
      path = "";

      // update icon color
      const inputColor = document.getElementById("inputColor");
      if (inputColor) {
        inputColor.style.backgroundColor = val.replaceAll('"', "");
      }
    }
  }, []);

  const onKeyDown = React.useCallback((event) => {
    event.stopPropagation();
    console.log("event.tareget", event.target.value);
    // restore from input to the original label
    restoreLabel(event.target);
    // event.target.blur();

    if (event.key === "ArrowDown" || event.key === "Tab") {
      // this condition is to delete the input color in case of moving down or up
      console.log("event.target", event.target);
      if (!event.target.className.split(" ").includes("inline-color-wrapper")) {
        console.log("remove keyDown");
        removeColorElement(event.target);
      }
      removeIdElements();
      event.target.setAttribute("contentEditable", false);
      movefocus(event.target, "down");
    }

    if (event.key === "ArrowUp") {
      if (!event.target.className.split(" ").includes("inline-color-wrapper")) {
        removeColorElement(event.target);
      }
      // remove id that points to input and content editable  helps to handle with useffect
      removeIdElements();
      // change this targe to editable false, remove focus
      event.target.setAttribute("contentEditable", false);
      movefocus(event.target, "up");
    }
  }, []);

  console.log(value);

  const onBlur = React.useCallback((event) => {
    event.stopPropagation();
    console.log("onBlur", event.target);
    console.log("onBlur keycode", event.target.keyCode);

    // detect an event comming from the input editable
    restoreLabel(event.target);
    // if (event.target.id === "inputEditable") {
    //   let valueInput = event.target.value;
    //   let parentElement = event.target.parentElement;
    //   // create text node
    //   const text = document.createTextNode(valueInput);
    //   event.target.remove();
    //   // this will return the old content with a text node
    //   parentElement.appendChild(text);
    // }

    // remove if it not the input
    // if (!event.target.className.split("").includes("inline-color-wrapper")) {
    //   removeColorElement(event);
    // }
  }, []);

  const onInput = React.useCallback((event) => {
    event.stopPropagation();

    if (event.target.id === "inputEditable") {
      event.target.style.width = event.target.value.length + "ch";
    }
  }, []);

  const onFocus = React.useCallback((event) => {
    event.stopPropagation();

    if (event.target.id === "inputEditable") {
      event.target.style.width = event.target.value.length + "ch";
    }
  }, []);

  return (
    <div
      className="App"
      onKeyUp={onKeyUp}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onInput={onInput}
      onFocus={onFocus}
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
    console.log("target recursive", target);
    if (target.nextSibling === null) {
      console.log("notfound", target);
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
      console.log("found target", target);
      refLastFocus = target;
      insertColorElement(target);
      console.log("target after insert color element", target);
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
    // console.log("selection target", target.childNodes);

    let range = new Range();

    // will check if has more than a childnode
    // if has one more, it will be ainput color, otherwise a number or float
    // todo more
    // if (target.childNodes[1]) {
    //   range.selectNodeContents(target.childNodes[1]);
    // } else {
    //   range.selectNodeContents(target.childNodes[0]);
    // }
    // range.selectNodeContents(target.childNodes[1]);
    // range.setStart(target.childNodes[1], 0);
    // range.setEnd(target.childNodes[1], 1);
    // range.selectNodeContents(target.childNodes[1]);
    selection.removeAllRanges();
    window.getSelection().addRange(range);
  }, 50);
};

const removeIdElements = () => {
  const spanColorContent = document.getElementById("currentEditing");
  const inputColor = document.getElementById("inputColor");

  if (spanColorContent) {
    spanColorContent.removeAttribute("id");
  }

  if (inputColor) {
    inputColor.removeAttribute("id");
  }
};

const inputElement = (target) => {
  const span = target.querySelector("span");
  console.log("inputElement", target.childNodes, span);
  for (const child of target.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      console.log(child.nodeValue);
    }
  }
};

const insertInputNextSpan = (node) => {
  // event.target.setAttribute("contentEditable", true);
  let input = document.createElement("input");
  // save previous content
  // let innerText = node.innertText;
  // console.log("innerText", );
  node.style.display = "none";
  input.value = node.innerText;

  input.setAttribute("id", "inputEditing");
  // node
  node.after(input);
};

const restoreLabel = (node) => {
  if (node.tagName.toLowerCase() === "input") return;

  if (node.id === "inputEditable") {
    console.log("node", node);
    let valueInput = node.value;
    let parentElement = node.parentElement;
    // create text node
    const text = document.createTextNode(valueInput);
    node.remove();
    // this will return the old content with a text node
    parentElement.appendChild(text);
  }
};
