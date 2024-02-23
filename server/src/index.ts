import express, { Express, Request, Response } from "express";
import { Account } from "./shared/loadData";
import { fs } from "./shared/fs-poly/native";
import { API } from "./shared/const";

const app: Express = express();
const port = 3000;

if (!!process.env.DATA) {
  process.chdir(process.env.DATA);
} else {
  console.error("Must set DATA environment variable!");
  process.exit(1);
}

const account = new Account(fs, API);

app.get("/instagram/api", (req: Request, res: Response) => {
  account.getPosts().then(posts => res.type("application/json").send(JSON.stringify(posts)));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});