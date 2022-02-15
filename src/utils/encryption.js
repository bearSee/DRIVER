import CryptoJS from 'sibionics-ui/node_modules/crypto-js/crypto-js';

 const key = 'DRIVER@HOME@2022';
// AES加密
const encryptAES = (word) => {
    const keys = CryptoJS.enc.Utf8.parse(key);
    const encryptedWord = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(encryptedWord, keys, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
};

// AES解密
const decryptAES = (word) => {
    const keys = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(word, keys, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export {
    encryptAES,
    decryptAES,
};
