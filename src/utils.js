import React from "react";

const HEX_COLOR = /^#?((?:[\da-f]){3,4}|(?:[\da-f]{2}){3,4})$/i;

function validateColor(color) {
  var s = new Option().style;
  s.color = color;
  return s.color ? color : undefined;
}

export const insertColorElement = (node) => {
  const outerHtml = node.outerHTML;
  let prevInnerText = node.innerText;

  console.log("outerHTML", outerHtml);
  console.log("innerText", prevInnerText);
  console.log("isNumber", isNumber(prevInnerText));

  if (isNumber(prevInnerText)) return;

  // get content inside ""
  prevInnerText = prevInnerText
    .match(/(?:"[^"]*"|^[^"]*$)/)[0]
    .replace(/"/g, "");

  // validate if is valida hext color
  let isValidHex = HEX_COLOR.exec(prevInnerText);
  let isValidColor = validateColor(isValidHex);
  console.log("isValiedColor", isValidColor);

  console.log("isValidHex", isValidHex);

  if (!isValidHex & !validateColor(prevInnerText)) {
    return node;
  }

  let newSpanElement = document.createElement("span");

  var previewElement =
    '<span id="inputColor" contenteditable="false" class="inline-color-wrapper"><input  type="color" class="inline-color" style="background-color:' +
    prevInnerText +
    ';"></input></span>';

  newSpanElement.innerHTML = previewElement;

  // node.innerHTML = previewElement + prevInnerText;

  node.innerHTML = newSpanElement.innerHTML + '"' + prevInnerText + '"';
  // node.innerHTML = newSpanElement.innerHTML + prevInnerText;
  // console.log("Component", <ColorComponent />);

  // node.innerHTML = <ColorComponent />;

  console.log("node component", node);

  const inputColor = newSpanElement.getElementsByTagName("input");

  console.log("inputColor", inputColor[0]);

  inputColor[0].addEventListener("click", (event) => {
    // event.stopPropagation();
    // setTimeout(() => event.target.focus(), 50);
  });

  console.log("node insertColorElement", node.innerText);

  // return node;j
};

export const removeColorElement = (node) => {
  // element.classList.remove("mystyle");
  console.log("classList", node.classList);
  // document.getElementsByClassName("column");

  const spanInlineColor = node.getElementsByClassName("inline-color-wrapper");

  for (const el of spanInlineColor) {
    el.parentNode.removeChild(el);
  }
};

export const isNumber = (val) => {
  return !!parseInt(val);
};

export const ColorComponent = () => {
  return <div>hola</div>;
};
