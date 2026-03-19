const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: "postgres_db",
  user: "admin",
  password: "admin123",
  database: "mydb",
  port: 5432,
});

// create table automatically
pool.query(`
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
name TEXT
);
`);

app.get("/health", (req,res)=>{
  res.send("API is running");
});

app.post("/user", async (req,res)=>{
  const {name} = req.body;
  await pool.query("INSERT INTO users(name) VALUES($1)",[name]);
  res.send("User added");
});

app.get("/users", async (req,res)=>{
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.listen(3000,()=>{
  console.log("Server running on port 3000");
});