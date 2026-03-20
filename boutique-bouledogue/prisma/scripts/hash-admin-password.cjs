/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run hash:admin -- <mot-de-passe>");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("Collez cette valeur dans ADMIN_PASSWORD_HASH :");
  console.log(hash);
});
