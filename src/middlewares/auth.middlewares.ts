import express from "express";

function auth(req: express.Request, res: express.Response, next: any) {
  if (!req.session || !req.session.user) {
    return res.status(401).send("not auth");
  }
  next();
}

export { auth };
