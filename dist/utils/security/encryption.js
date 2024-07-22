import Cryptr from "cryptr";
var encryptionString = process.env.ENCRYPTION_STRING;
if (!encryptionString) {
    throw new Error("ENCRYPTION_STRING environment variable is not set or is empty");
}
export var cryption = new Cryptr(encryptionString);
export var encrypt = function (text) {
    return cryption.encrypt(text);
};
export var decrypt = function (hash) {
    return cryption.decrypt(hash);
};
