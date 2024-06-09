import { NextFunction, Request, Response } from "express";

export const responseTime = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  res.on("finish", () => {
    const responseTime = Date.now() - start;
    console.log(`Request to ${req.path} took ${responseTime}ms`);
  });
  next();
};
