const mysql = require("mysql2/promise");
const fs = require("fs");
const readline = require("readline/promises");
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const password = await rl.question("Aiven MySQL password: ");
  rl.close();
  const connection = await mysql.createConnection({
    host: "mysql-d6e1686-sabariyasabariya927-e9ca.d.aivencloud.com",
    port: 25320,
    user: "avnadmin",
    password,
    database: "defaultdb",
    ssl: { ca: fs.readFileSync("ca.pem") }
  });
  const [tables] = await connection.query("SHOW TABLES");
  console.log("\nDatabase tables:");
  console.table(tables);
  const [columns] = await connection.query("DESCRIBE users");
  console.log("\nUsers table columns:");
  console.table(columns.map(c => ({
    Field: c.Field,
    Type: c.Type
  })));
  await connection.end();
}
main().catch(err => {
  console.error("Connection error:", err.message);
  process.exitCode = 1;
});

