import express, { Request, Response, Application } from "express";
import { getSheet } from "./googleSheetsService";
require("dotenv").config();

const app: Application = express();

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!");
});

app.listen(8000, (): void => {
  console.log(`Server Running here 👉 https://localhost:8000`);
});

console.log(process.argv[2]);
getSheet("test");
