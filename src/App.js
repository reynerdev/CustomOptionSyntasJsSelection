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
        event.target.style.backgroundColor = event.target.value;
        console.log("eventssss", event.target);
        insertColorElement(spanColorContent);
        getPath(spanColorContent);
        setValue({ ...{ path: path, value: event.target.value } });
        // path = "";
      }
      // inputColor.focus();
    });
  }, []);

  const onMouseDown = React.useCallback((event) => {
    console.log("event", event.target);
    console.log("event", event.target.innerText);

    const find = findRecursiveNode(event.target, "");
    console.log("findassss", find);
    // return;
    // remove current ids
    if (
      event.target.id !== "inlineColorWrapper" ||
      event.target.id !== "currentEditing" ||
      event.target.id !== ""
    ) {
      console.log("removeidelement");
      // removeIdElements();
    }
    // avoid edting on inputcolor
    if (event.target.className.split(" ").includes("inline-color")) {
      return;
    }
    console.log("childnode", event.target.className !== "");

    const isEditable =
      !event.target.className.includes("property") &&
      !event.target.className.includes("string-property") &&
      !event.target.className.includes("punctuation") &&
      !event.target.className.includes("operator") &&
      !event.target.className.includes("linenumber") &&
      !event.target.className.includes("prismjs") &&
      !event.target.className.includes("inline-color-wrapper");
    console.log("isEditable", isEditable);
    if (isEditable && event.target.className !== "") {
      // check if the current target has id currentEditing, if yes do nothing
      // if the current target doesnt have a currentEditing Id, do nothing, it will be added later
      //
      const nodeEditing = document.getElementById("currentEditing");

      if (!event.target.isSameNode(nodeEditing)) {
        removeIdElements();
        removeInputColor();
      }

      event.target.setAttribute("contentEditable", true);
      // console.log("mousedown", event.target.childNodes);
      // console.log("innertText", event.target.innerText);
      // insertInputNextSpan(event.target);
      insertColorElement(event.target);
      console.log("e", event.target);
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

      path = "";
      findRecursiveNode(event.target);
      console.log("path,setvalue", path, event.target);
      setValue({ ...{ path: path, value: val } });

      // update icon color
      const inputColor = document.getElementById("inputColor");
      console.log("val", val);
      if (inputColor) {
        // console.log("inputColor", inputColor, val, val.replaceAll('"', ""));

        // console.log("patternamsk", patternMask.resolve(val).value);

        inputColor.style.backgroundColor = val.replaceAll('"', "");
        console.log("after inputcolor", inputColor);
      }
    }
  }, []);

  const onKeyDown = React.useCallback((event) => {
    event.stopPropagation();
    console.log("keycode", event.key);
    if (event.key === "ArrowDown" || event.key === "Tab") {
      // this condition is to delete the input color in case of moving down or up
      console.log("event.target", event.target);
      if (!event.target.className.split(" ").includes("inline-color-wrapper")) {
        removeColorElement(event.target);
      }
      removeIdElements();
      removeInputColor();
      event.target.setAttribute("contentEditable", false);
      movefocus(event.target, "down");
    }

    if (event.key === "ArrowUp") {
      if (!event.target.className.split(" ").includes("inline-color-wrapper")) {
        removeColorElement(event.target);
      }
      // remove id that points to input and content editable  helps to handle with useffect
      removeIdElements();
      removeInputColor();
      // change this targe to editable false, remove focus
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

  return (
    <div className="App" ref={wrapperRef} tabIndex={-1}>
      <SyntaxHighlighter
        language="javascript"
        useInlineStyles={false}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
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
    if (target.childNodes[1]) {
      range.selectNodeContents(target.childNodes[1]);
    } else {
      range.selectNodeContents(target.childNodes[0]);
    }
    // range.selectNodeContents(target.childNodes[1]);
    // range.setStart(target.childNodes[1], 0);
    // range.setEnd(target.childNodes[1], 1);
    // range.selectNodeContents(target.childNodes[1]);
    selection.removeAllRanges();
    window.getSelection().addRange(range);
  }, 50);
};

const removeIdElements = () => {
  console.log("removeIdElement");
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
  input.value = node.innerText;

  input.setAttribute("id", "inputEditing");
  // node
  node.after(input);
};

const removeInputColor = () => {
  document.getElementById("inlineColorWrapper")?.remove();
};

const findNearestKeyParentProperty = (node) => {
  // nearest fparent property is the one before the brackets {}
  // 1. find the first token string-property property, (left )
  // 2. find the first open bracket ' { ", if a close bracket is found
  // ' } ' means that the next opened bracket ' { ' , shouldn't be taken
  // if (node)

  if (node.previousSibling === null) {
    // nothing was found
    return;
  } else {
    // if (target.className.includes)
    // check the first
  }
};

const findUpRecursiveByInnerText = (node, innerText, path) => {
  console.log("findup", node, path);
  if (node.previousSibling === null) {
    // return null innerText hastn't been found
    return null;
  } else {
    if (node.innerText === innerText) {
      if (path === "") {
        path = node.innertText;
      } else {
        path = node.innerText + "." + path;
      }
    }
    findUpRecursiveByInnerText(node.previousSibling, innerText, path);
  }
};

let leftOpenBracket = false;
let listOpenBracket = [];
let listCloseBracket = [];

const findRecursiveNode = (node) => {
  console.log("findup", node, node.innerText, path, leftOpenBracket);

  if (node.previousSibling === null) {
    // return null innerText hastn't been found
    console.log("paths", path);
    // return null;
    path = path;
    // return path;
  } else {
    if (node.innerText === "}") {
      listCloseBracket.push("}");
    }
    if (node.innerText === "{") {
      // listOpenBracket.push["{"];
      const elementPopped = listCloseBracket.pop();

      if (typeof elementPopped === "undefined") {
        // means that the there is a left open bracket
        leftOpenBracket = true;
      }
    }
    console.log(listCloseBracket, listOpenBracket);

    // if (node.innerText === "{" && hasclosebracket) {
    //   listOpenBracket.push["{"];
    // }

    if (leftOpenBracket) {
      if (node.className.includes("string-property")) {
        if (path === "") {
          path = node.innerText;
        } else {
          path = node.innerText + "." + path;
        }
        leftOpenBracket = false;
      }
    }

    findRecursiveNode(node.previousSibling, path);
  }
};

// const getPath = (target) => {
//   if (target.previousSibling === null) {
//     console.log("finalPath", path);
//     return;
//   } else {
//     if (target.className.includes("string-property")) {
//       if (path === "") {
//         path = target.innerText;
//       } else {
//         path = target.innerText + "." + path;
//       }
//     }
//     getPath(target.previousSibling);
//   }
// };

// const findNodeResursive = (node , class) => {

//   if (node.previousSibling === null) {

//     return;

//   }

// }
// const recursiveSearchUp = (target) => {
//     if (target.previousSibling === null) {
//       // in case reach the end of the object , to avoid scrolling  off
//       // the content
//       insertColorElement(refLastFocus);
//       addSelection(refLastFocus);

//       first = false;
//       return;
//     }

//     if (
//       (target.className.split(" ").includes("string") ||
//         target.className.split(" ").includes("number")) &&
//       !first
//     ) {
//       refLastFocus = target;
//       insertColorElement(target);
//       addSelection(target);
//       first = false;
//       return;
//     }
//     first = false;

//     recursiveSearchUp(target.previousSibling);
//   };
