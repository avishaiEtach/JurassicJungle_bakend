import session from "express-session";
import { User } from "./types/UserTypes";

declare module "express-session" {
  interface SessionData {
    user: User | undefined;
    visited: boolean;
  }
}

const sessionConfig: session.SessionOptions = {
  secret: "your_secret_key", // Replace with your secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: false, // Make sure this is false to access cookie in JavaScript
    sameSite: "lax", // Adjust as needed (lax, strict, or none)
  },
};

export { session, sessionConfig };
