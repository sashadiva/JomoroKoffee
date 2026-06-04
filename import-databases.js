const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';

const files = ['databases/jomoro_koffee.sql'];

async function loadFile(filePath) {
  const absolutePath = path.join(__dirname, filePath);
  return fs.readFile(absolutePath, 'utf8');
}

async function importSql() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    for (const file of files) {
      const sql = await loadFile(file);
      process.stdout.write(`Importing ${file}... `);
      await connection.query(sql);
      console.log('done');
    }
    console.log('Database import completed successfully.');
  } catch (error) {
    console.error('Database import failed:', error.message || error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

importSql();
