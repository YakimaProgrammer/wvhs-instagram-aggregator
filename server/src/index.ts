import express, { Express, Request, Response } from "express";
import { Account } from "./shared/loadData";
import { fs } from "./shared/fs-poly/native";

const app: Express = express();
const port = 3000;

const base = process.env.DATA || "/this/should/not/exist/";
const account = new Account(new fs(base), "https://api.magnusfulton.com/instagram/");

app.get("/instagram/api", (req: Request, res: Response) => {
  account.getPosts().then(posts => res.send(JSON.stringify(posts)));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});