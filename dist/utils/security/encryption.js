import Cryptr from "cryptr";
console.log("ENCRYPTION_STRING: ".concat(process.env.ENCRYPTION_STRING));
var encryptionString = process.env.ENCRYPTION_STRING;
if (!encryptionString) {
    throw new Error("ENCRYPTION_STRING environment variable is not set or is empty");
}
var cryption = new Cryptr(encryptionString);
export default cryption;
