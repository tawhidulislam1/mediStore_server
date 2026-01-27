import express, { NextFunction, Request, Response, Router } from "express";

import { auth as betterAuth } from "../lib/auth";

export enum USERROLE {
  USER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: String;
        name: String;
        email: String;
        role: String;
      };
    }
  }
}
const auth = (...roles: USERROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Your are not authorlized",
        });
      }
      req.user = {
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: session.user.role as string,
      };
      if (roles.length && !roles.includes(req.user.role as USERROLE)) {
        return res.status(403).json({
          success: false,
          message: "forbiden",
        });
      }
      next();
    } catch (error) {
      throw error;
    }
  };
};

export default auth;
