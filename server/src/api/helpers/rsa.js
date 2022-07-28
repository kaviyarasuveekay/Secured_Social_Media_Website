const bigInt = require('big-integer');

// Check prime  number
const isPrime = (prime) => {
	let i, j;
	j = parseInt(Math.sqrt(prime))
	for (i = 2; i <= j; i++) {
			if (prime % i === 0) {
					return false;
			}
	}
	return true;
}

// GCD
const greatestCommonDivisor = (i, t) => {
	while (i > 0) {
			temp = i;
			i = t % i;
			t = temp;
	}
	return t;
}

//  Calculate E
const calculateE = (n) => {
	for (let i = 2; i <= n; i++) {
			if (greatestCommonDivisor(i, n) === 1) {
					return i;
					break;
			}
	}
}

// Calculate D
const calculateD = (e, n) => {
	let k = 1;
	let d = 0;
	while (true) {
			k = k + n;
			if (k % e === 0) {
					d = k / e;
					break;
			}
	}
	return d;
}

// Encrypt
const encrypt = (plainText) => {
	const p = 13;
	const q = 23;
	
	const n = parseInt(p) * parseInt(q); 
	const qN = (p - 1) * (q - 1);
	
	const e = calculateE(qN);
	const d =calculateD(e, qN);

	const cipherText = []
	for (let i = 0; i < plainText.length; i++) {
		// Changing  every letter into number
		cipherText.push(Math.pow(plainText.charCodeAt(i), e) % n); 
	}
	return cipherText; //return cipher  text
}

// Decrypt
const decrypt = (cipherText) => {
	const p = 13;
	const q = 23;
	
	const n = parseInt(p) * parseInt(q); 
	const qN = (p - 1) * (q - 1);
	
	const e = calculateE(qN);
	const d =calculateD(e, qN);

	const plainText = [];
	const bD = bigInt(d);
	const bN = bigInt(n);

	for (let i = 0; i < cipherText.length; i++) {
		// Decrypting every number to corresponding letters
		const bC = bigInt(cipherText[i]);
		plainText.push(String.fromCharCode(bC.modPow(bD, bN))); 
	}
	return plainText
}

const example = () => {
  const msg = "Hellooooo";
  console.log(msg)

  const ct = encrypt(msg);
  console.log(ct);

  const pt = decrypt(ct);
  console.log(pt);
}
example();

module.exports = {
  encrypt, decrypt
}