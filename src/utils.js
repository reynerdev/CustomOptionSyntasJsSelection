import React from "react";

const HEX_COLOR = /^#?((?:[\da-f]){3,4}|(?:[\da-f]{2}){3,4})$/i;

function validateColor(color) {
  var s = new Option().style;
  s.color = color;
  return s.color ? color : undefined;
}

export const insertColorElement = (node) => {
  let prevInnerText = node.innerText;

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
    '<span id="inlineColorWrapper" contenteditable="false" class="inline-color-wrapper"><input  type="color" id="inputColor" class="inline-color" style="background-color:' +
    prevInnerText +
    ';"></input></span>';

  newSpanElement.innerHTML = previewElement;

  // add className to string to reference
  node.setAttribute("id", "currentEditing");

  // node.innerHTML = previewElement + prevInnerText;
  node.before(newSpanElement);

  // node.innerHTML = newSpanElement.innerHTML + '"' + prevInnerText + '"';
  // node.innerHTML =
  // newSpanElement.innerHTML + "<span>" + prevInnerText + "</span>";
  // node.innerHTML = newSpanElement.innerHTML + prevInnerText;
  // console.log("Component", <ColorComponent />);

  // node.innerHTML = <ColorComponent />;

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
