import React from "react";
import IMask from "imask";

const mask = {
  mask: "{#}******"
  // lazy: false
  // placeholderChar: ""
};
// const mask = {
//   mask: [
//     {
//       mask: "{rgba(}`RGB,RGB,RGB{)}",
//       blocks: {
//         RGB: {
//           mask: IMask.MaskedRange,
//           from: 0,
//           to: 255
//         }
//       }
//     },
//     {
//       mask: /^#[0-9a-f]{0,6}$/i
//     }
//   ]
// };
// const mask = {
//   mask: [
//     {
//       mask: /^#[0-9a-f]{0,6}$/i,
//       lazy: false,
//       placeholderChar: "#"
//     }
//   ]
// };
// let val = val.replaceAll('"', "");

// var patternMask = IMask.createMask(mask);
const HEX_COLOR = /^#?((?:[\da-f]){3,4}|(?:[\da-f]{2}){3,4})$/i;

function validateColor(color) {
  var s = new Option().style;
  s.color = color;
  return s.color ? color : undefined;
}

export const insertColorElement = (node) => {
  console.log("insertColorElement");
  let prevInnerText = node.innerText;

  // remove existing input color
  // let inputColor = document.getElementById("inlineColorWrapper");
  // check if doble
  // if (inputColor) inputColor.remove();

  // only for string
  if (isNumber(prevInnerText)) return;

  // get content inside ""
  prevInnerText = prevInnerText
    .match(/(?:"[^"]*"|^[^"]*$)/)[0]
    .replace(/"/g, "");

  // validate if is valida hext color
  let isValidHex = HEX_COLOR.exec(prevInnerText);
  let isValidColor = validateColor(isValidHex);

  // if not valid hex code or color return end the function
  if (!isValidHex & !validateColor(prevInnerText)) {
    return node;
  }

  let newSpanElement = document.createElement("span");
  let input = document.createElement("input");
  input.setAttribute("id", "inputEditable");
  IMask(input, mask);
  // input.setAttribute("contentEditable", true);
  input.value = prevInnerText; // add the span text in the input

  // create the replace element
  var previewElement =
    '<span id="inlineColorWrapper" contenteditable="false" class="inline-color-wrapper"><input  type="color" id="inputColor" class="inline-color" style="background-color:' +
    prevInnerText +
    ';"></input></span>';

  newSpanElement.innerHTML = previewElement;
  // newSpanElement.after(input);

  // add className to string to reference
  node.setAttribute("id", "currentEditing");

  // node.innerHTML = previewElement + prevInnerText;

  node.innerHTML = newSpanElement.innerHTML; //+ '"' + prevInnerText + '"';
  node.appendChild(input);

  // node.addEventListener("blur", (event) => {
  //   setTimeout(() => {
  //     console.log("blur", prevInnerText, event.target.innerHTML);
  //     newSpanElement.remove();
  //     input.remove();
  //     event.target.innertText = prevInnerText;
  //   }, [50]);
  // });
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
