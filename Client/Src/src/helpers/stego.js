// const dataUrl = "data:image/png;base64," + process.env.REACT_APP_SECRET_IMG;

// var img = new Image();
// img.onload = function() {
//   var canvas = document.getElementById('canvas');
//   var ctx = canvas.getContext('2d');
//   ctx.canvas.width = img.width;
//   ctx.canvas.height = img.height;
//   ctx.drawImage(img, 0, 0);
//   // ...
// };
// img.src = dataUrl;

// var message = "hi";

// var getBit = function(number, location) {
//   return ((number >> location) & 1);
// };

// var getBitsFromNumber = function(number) {
//   var bits = [];
//   for (var i = 0; i < 16; i++) {
//     bits.push(getBit(number, i));
//   }
//   return bits;
// };

// var messageBits = [];
// for (var i = 0; i < message.length; i++) {
//   var code = message.charCodeAt(i);
//   var bits = getBitsFromNumber(code);
//   messageBits = messageBits.concat(bits);
// }

let dataUrl = "data:image/png;base64," + process.env.REACT_APP_SECRET_IMG;
let img = new Image();
img.onload = () => {
	let ctx = document.getElementById("canvas").getContext("2d");
	ctx.canvas.width = img.width;
	ctx.canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
};
img.src = dataUrl;

// Encodes message using LSB method
function encodeMessage(colors, message) {
  let messageBits = getBitsFromNumber(message.length);
  messageBits = messageBits.concat(getMessageBits(message));
  let history = [];
  let pos = 0;
  while (pos < messageBits.length) {
    let loc = getNextLocation(history, colors.length);
    colors[loc] = setBit(colors[loc], 0, messageBits[pos]);
    while ((loc + 1) % 4 !== 0) {
      loc++;
    }
    colors[loc] = 255;
    pos++;
  }
	return colors;
}

// Decodes message from the image
function decodeMessage(colors) {
  let history = [];
  let messageSize = getNumberFromBits(colors, history);
  if ((messageSize + 1) * 16 > colors.length * 0.75) {
    return "";
  }
  if (messageSize === 0) {
    return "";
  }
  let message = [];
  for (let i = 0; i < messageSize; i++) {
    let code = getNumberFromBits(colors, history);
    message.push(String.fromCharCode(code));
  }
  return message.join("");
}

function getBit(number, location) {
  return (number >> location) & 1;
}

// sets the bit in 'location' to 'bit' (either a 1 or 0)
function setBit(number, location, bit) {
  return (number & ~(1 << location)) | (bit << location);
}

// returns an array of 1s and 0s for a 2-byte number
function getBitsFromNumber(number) {
  let bits = [];
  for (let i = 0; i < 16; i++) {
    bits.push(getBit(number, i));
  }
  return bits;
}

// returns the next 2-byte number
function getNumberFromBits(bytes, history) {
  let number = 0,
    pos = 0;
  while (pos < 16) {
    let loc = getNextLocation(history, bytes.length);
    let bit = getBit(bytes[loc], 0);
    number = setBit(number, pos, bit);
    pos++;
  }
  return number;
}

// returns an array of 1s and 0s for the string 'message'
function getMessageBits(message) {
  let messageBits = [];
  for (let i = 0; i < message.length; i++) {
    let code = message.charCodeAt(i);
    messageBits = messageBits.concat(getBitsFromNumber(code));
  }
  return messageBits;
}

// gets the next location to store a bit
function getNextLocation(history, total) {
  let loc = 0;
  while (true) {
    if (history.indexOf(loc) >= 0) {
      loc++;
    } else if ((loc + 1) % 4 === 0) {
      loc++;
    } else {
      history.push(loc);
      return loc;
    }
  }
}

module.exports = { encodeMessage, decodeMessage };
