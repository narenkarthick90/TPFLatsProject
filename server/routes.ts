import { Express } from "express";
import { Server } from "http";
import nodemailer from "nodemailer";

const otpStore: Record<string, string> = {};

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function registerRoutes(httpServer: Server, app: Express) {

  // middleware to check login
  function isAuthenticated(req: any, res: any, next: any) {

    if (!req.session.user) {
      return res.status(401).json({ message: "Not logged in" })
    }

    req.user = req.session.user
    next()

  }

  // =========================
  // SEND OTP
  // =========================
  app.post("/api/send-otp", async (req: any, res) => {

    const { email } = req.body

    const regex = /^[a-zA-Z0-9]+@nitt\.edu$/

    if (!regex.test(email)) {
      return res.status(400).json({ message: "Use NITT email" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    otpStore[email] = otp

    try {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "NITT Hub OTP Verification",
        html: `<h2>Your OTP is ${otp}</h2>`
      })

      res.json({ message: "OTP sent successfully" })

    } catch (err) {

      console.error(err)
      res.status(500).json({ message: "Failed to send OTP" })

    }

  })


  // =========================
  // VERIFY OTP
  // =========================
  app.post("/api/verify-otp", (req: any, res) => {

    const { email, otp } = req.body

    if (otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    delete otpStore[email]

    const rollno = email.split("@")[0]

    req.session.user = {
      id: rollno,
      email
    }

    res.json({
      message: "login success",
      user: req.session.user
    })

  })


  // LOGIN ROUTE
  app.post("/api/login", (req: any, res) => {

    const { email } = req.body

    const regex = /^[a-zA-Z0-9]+@nitt\.edu$/

    if (!regex.test(email)) {
      return res.status(400).json({ message: "Use NITT email" })
    }

    const rollno = email.split("@")[0]

    req.session.user = {
      id: rollno,
      email
    }

    res.json({
      message: "login success",
      user: req.session.user
    })

  })


  // LOGOUT
  app.post("/api/logout", (req: any, res) => {

    req.session.destroy(() => {
      res.json({ message: "logged out" })
    })

  })


  // TEST PROTECTED ROUTE
  app.get("/api/me", isAuthenticated, (req: any, res) => {

    res.json(req.user)

  })

  return httpServer
}