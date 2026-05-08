// src/middlewares/logger.ts

import { Request, Response, NextFunction } from "express";

export function logger(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const data = new Date().toLocaleString();

  console.log(
    `[${data}] ${req.method} ${req.url}`
  );

  next();
}