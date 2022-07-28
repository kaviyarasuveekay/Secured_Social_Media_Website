const power = (a, b) => {
	if(b === 0)
			return 1;

	let pow = 1

	for(let i = 1; i < b + 1; i++)
			pow = a * pow

	return pow;
}  


const powerMod = (a, b, c) => {
	if(b === 0)
			return 1;

	let pow = 1

	for(let i = 1; i < b + 1; i++)
			pow = (a * pow) % c;

	return pow;
}

const primesInRange = (x, y) => {
	let primeList = []
	for(let i = x; i < y; i++) {
		let isPrime = true;
		for(let num = 2; num < i; i++)
				if (i % num === 0)
						isPrime = false
	
		if (isPrime)
			primeList.push(i)

	}
    return primeList
}


const keyGeneration = (p, g) => {
	var privateKey, publicKey;
  privateKey = Math.random.randint(2, p - 1);
  publicKey = powerMod(g, privateKey, p);
  return [publicKey, privateKey];
}  
	
const encryption = (p, g, publicKey, message) => {
  var c1, c2, ct, k;

  k = Math.random.randint(2, p - 1);
  
	ct = [];
  

  for (var i = 0, _pj_a = message.length; i < _pj_a; i += 1) {
    ct.append(message[i]);
  }

  c1 = powerMod(g, k, p);
  c2 = powerMod(publicKey, k, p);

  for (var i = 0, _pj_b = ct.length; i < _pj_b; i += 1) {
    ct[i] = c2 * ord(ct[i]);
  }

  return [c1, ct];
}

function decryption(p, privateKey, c1, c2) {
  var plainText, pt, x;
  x = powerMod(c1, privateKey, p);
  pt = [];

  for (var i = 0, _pj_a = c2.length; i < _pj_a; i += 1) {
    pt.append(String(Number.parseInt(c2[i] / x)));
  }

  plainText = "".join(pt);
  return plainText;
}
