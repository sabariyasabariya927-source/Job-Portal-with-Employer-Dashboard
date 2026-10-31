const mysql = require("mysql2/promise");
const fs = require("fs");
const readline = require("readline/promises");
async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const password = await rl.question("Aiven MySQL password: ");
  const email = await rl.question("Your registered email: ");
  rl.close();
  const db = await mysql.createConnection({
    host: "mysql-d6e1686-sabariyasabariya927-e9ca.d.aivencloud.com",
    port: 25320,
    user: "avnadmin",
    password,
    database: "defaultdb",
    ssl: { ca: fs.readFileSync("ca.pem") }
  });
  const [rows] = await db.execute(
    "SELECT email, role, is_verified FROM users WHERE email = ?",
    [email]
  );
  console.table(rows.map(r => ({
    email: r.email,
    role: r.role,
    is_verified: Buffer.isBuffer(r.is_verified)
      ? r.is_verified[0] !== 0
      : Boolean(r.is_verified)
  })));
  await db.end();
}
main().catch(e => console.error("Error:", e.message));
