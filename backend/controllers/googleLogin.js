import { OAuth2Client } from "google-auth-library";
import Auth from "../models/Authmodel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("[googleLogin] received token length:", token?.length);
    console.log("[googleLogin] server time (s):", Math.floor(Date.now() / 1000));

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("[googleLogin] token payload:", {
      email: payload?.email,
      name: payload?.name,
      sub: payload?.sub,
    });

    const { email, name, picture, sub } = payload;

    let user = await Auth.findOne({ email });

    if (!user) {
      // REGISTER
      user = await Auth.create({
        name,
        email,
        googleId: sub,
        image: picture,
        authProvider: "google",
      });
    }

    // LOGIN
    const authToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login success", user });
  } catch (error) {
    console.error("[googleLogin] error:", error?.stack || error);
    const msg = error?.message || "Internal Server Error";
    if (process.env.NODE_ENV === "production") {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(500).json({ message: msg, stack: error?.stack });
    }
  }
};