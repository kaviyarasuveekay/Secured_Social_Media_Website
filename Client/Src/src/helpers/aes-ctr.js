import Aes from "./aes.js";
class AesCtr extends Aes {
  static encrypt(plaintext, password, nBits) {
    if (![128, 192, 256].includes(nBits))
      throw new Error("Key size is not 128 / 192 / 256");
    plaintext = AesCtr.utf8Encode(String(plaintext));
    password = AesCtr.utf8Encode(String(password));

    // use AES itself to encrypt password to get cipher key (using plain password as source for key
    // expansion) to give us well encrypted key (in real use hashed password could be used for key)
    const nBytes = nBits / 8; // no bytes in key (16/24/32)
    const pwBytes = new Array(nBytes);
    for (let i = 0; i < nBytes; i++) {
      // use 1st 16/24/32 chars of password for key
      pwBytes[i] = i < password.length ? password.charCodeAt(i) : 0;
    }
    let key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes)); // gives us 16-byte key
    key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

    // initialise 1st 8 bytes of counter block with nonce (NIST SP 800-38A §B.2): [0-1] = millisec,
    // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
    const timestamp = new Date().getTime(); // milliseconds since 1-Jan-1970
    const nonceMs = timestamp % 1000;
    const nonceSec = Math.floor(timestamp / 1000);
    const nonceRnd = Math.floor(Math.random() * 0xffff);
    // for debugging: const [ nonceMs, nonceSec, nonceRnd ] = [ 0, 0, 0 ];
    const counterBlock = [
      // 16-byte array; blocksize is fixed at 16 for AES
      nonceMs & 0xff,
      (nonceMs >>> 8) & 0xff,
      nonceRnd & 0xff,
      (nonceRnd >>> 8) & 0xff,
      nonceSec & 0xff,
      (nonceSec >>> 8) & 0xff,
      (nonceSec >>> 16) & 0xff,
      (nonceSec >>> 24) & 0xff,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    // and convert nonce to a string to go on the front of the ciphertext
    const nonceStr = counterBlock
      .slice(0, 8)
      .map((i) => String.fromCharCode(i))
      .join("");

    // convert (utf-8) plaintext to byte array
    const plaintextBytes = plaintext.split("").map((ch) => ch.charCodeAt(0));

    // ------------ perform encryption ------------
    const ciphertextBytes = AesCtr.nistEncryption(
      plaintextBytes,
      key,
      counterBlock
    );

    // convert byte array to (utf-8) ciphertext string
    const ciphertextUtf8 = ciphertextBytes
      .map((i) => String.fromCharCode(i))
      .join("");

    // base-64 encode ciphertext
    const ciphertextB64 = AesCtr.base64Encode(nonceStr + ciphertextUtf8);

    return ciphertextB64;
  }

  static nistEncryption(plaintext, key, counterBlock) {
    const blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4) for AES

    // generate key schedule - an expansion of the key into distinct Key Rounds for each round
    const keySchedule = Aes.keyExpansion(key);

    const blockCount = Math.ceil(plaintext.length / blockSize);
    const ciphertext = new Array(plaintext.length);

    for (let b = 0; b < blockCount; b++) {
      // ---- encrypt counter block; Oⱼ = CIPHₖ(Tⱼ) ----
      const cipherCntr = Aes.cipher(counterBlock, keySchedule);

      // block size is reduced on final block
      const blockLength =
        b < blockCount - 1
          ? blockSize
          : ((plaintext.length - 1) % blockSize) + 1;

      // ---- xor plaintext with ciphered counter byte-by-byte; Cⱼ = Pⱼ ⊕ Oⱼ ----
      for (let i = 0; i < blockLength; i++) {
        ciphertext[b * blockSize + i] =
          cipherCntr[i] ^ plaintext[b * blockSize + i];
      }

      // increment counter block (counter in 2nd 8 bytes of counter block, big-endian)
      counterBlock[blockSize - 1]++;
      // and propagate carry digits
      for (let i = blockSize - 1; i >= 8; i--) {
        counterBlock[i - 1] += counterBlock[i] >> 8;
        counterBlock[i] &= 0xff;
      }
    }

    return ciphertext;
  }

  static decrypt(ciphertext, password, nBits) {
    if (![128, 192, 256].includes(nBits))
      throw new Error("Key size is not 128 / 192 / 256");
    ciphertext = AesCtr.base64Decode(String(ciphertext));
    password = AesCtr.utf8Encode(String(password));

    // use AES to encrypt password (mirroring encrypt routine)
    const nBytes = nBits / 8; // no bytes in key
    const pwBytes = new Array(nBytes);
    for (let i = 0; i < nBytes; i++) {
      // use 1st nBytes chars of password for key
      pwBytes[i] = i < password.length ? password.charCodeAt(i) : 0;
    }
    let key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
    key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

    // recover nonce from 1st 8 bytes of ciphertext into 1st 8 bytes of counter block
    const counterBlock = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 8; i++) counterBlock[i] = ciphertext.charCodeAt(i);

    // convert ciphertext to byte array (skipping past initial 8 bytes)
    const ciphertextBytes = new Array(ciphertext.length - 8);
    for (let i = 8; i < ciphertext.length; i++)
      ciphertextBytes[i - 8] = ciphertext.charCodeAt(i);

    // ------------ perform decryption ------------
    const plaintextBytes = AesCtr.nistDecryption(
      ciphertextBytes,
      key,
      counterBlock
    );

    // convert byte array to (utf-8) plaintext string
    const plaintextUtf8 = plaintextBytes
      .map((i) => String.fromCharCode(i))
      .join("");

    // decode from UTF8 back to Unicode multi-byte chars
    const plaintext = AesCtr.utf8Decode(plaintextUtf8);

    return plaintext;
  }

  static nistDecryption(ciphertext, key, counterBlock) {
    const blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4) for AES

    // generate key schedule - an expansion of the key into distinct Key Rounds for each round
    const keySchedule = Aes.keyExpansion(key);

    const blockCount = Math.ceil(ciphertext.length / blockSize);
    const plaintext = new Array(ciphertext.length);

    for (let b = 0; b < blockCount; b++) {
      // ---- decrypt counter block; Oⱼ = CIPHₖ(Tⱼ) ----
      const cipherCntr = Aes.cipher(counterBlock, keySchedule);

      // block size is reduced on final block
      const blockLength =
        b < blockCount - 1
          ? blockSize
          : ((ciphertext.length - 1) % blockSize) + 1;

      // ---- xor ciphertext with ciphered counter byte-by-byte; Pⱼ = Cⱼ ⊕ Oⱼ ----
      for (let i = 0; i < blockLength; i++) {
        plaintext[b * blockSize + i] =
          cipherCntr[i] ^ ciphertext[b * blockSize + i];
      }

      // increment counter block (counter in 2nd 8 bytes of counter block, big-endian)
      counterBlock[blockSize - 1]++;
      // and propagate carry digits
      for (let i = blockSize - 1; i >= 8; i--) {
        counterBlock[i - 1] += counterBlock[i] >> 8;
        counterBlock[i] &= 0xff;
      }
    }

    return plaintext;
  }

  static utf8Encode(str) {
    try {
      return new TextEncoder()
        .encode(str, "utf-8")
        .reduce((prev, curr) => prev + String.fromCharCode(curr), "");
    } catch (e) {
      // no TextEncoder available?
      return unescape(encodeURIComponent(str)); 
    }
  }

  static utf8Decode(str) {
    try {
      return new TextEncoder()
        .decode(str, "utf-8")
        .reduce((prev, curr) => prev + String.fromCharCode(curr), "");
    } catch (e) {
      // no TextEncoder available?
      return decodeURIComponent(escape(str)); 
    }
  }

  static base64Encode(str) {
    if (typeof btoa != "undefined") return btoa(str); // browser
    if (typeof Buffer != "undefined")
      return new Buffer(str, "binary").toString("base64"); // Node.js
    throw new Error("No Base64 Encode");
  }

  static base64Decode(str) {
    if (typeof atob != "undefined") return atob(str); // browser
    if (typeof Buffer != "undefined")
      return new Buffer(str, "base64").toString("binary"); // Node.js
    throw new Error("No Base64 Decode");
  }
}

export default AesCtr;
