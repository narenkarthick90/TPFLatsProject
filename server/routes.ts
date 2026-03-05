import { Express } from "express";
import { Server } from "http";
import nodemailer from "nodemailer";
import { pool } from "./db";  
import { storage } from "./storage";

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

  app.get("/api/test-db", async (req,res)=>{

    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);

  });

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
  app.post("/api/verify-otp", async (req: any, res) => {

    const { email, otp } = req.body

    if (otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    delete otpStore[email]

    const rollno = email.split("@")[0]

    try {

      await pool.query(
        "INSERT INTO users (id,email) VALUES ($1,$2) ON CONFLICT (id) DO NOTHING",
        [rollno, email]
      )

      req.session.user = {
        id: rollno,
        email
      }

      res.json({
        message: "login success",
        user: req.session.user
      })

    } catch (err) {

      console.error(err)
      res.status(500).json({ message: "Database error" })

    }

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


  // =========================
  // GET USER PROFILE (FIXED)
  // =========================
  app.get("/api/me", isAuthenticated, async (req: any, res) => {

    try {

      const result = await pool.query(
        `SELECT 
          id,
          email,
          first_name,
          last_name,
          department,
          year_of_study,
          skills,
          bio,
          github_url,
          resume_url
        FROM users
        WHERE id=$1`,
        [req.user.id]
      )

      const user = result.rows[0]

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        year: user.year_of_study,
        skills: user.skills,
        bio: user.bio,
        githubUrl: user.github_url,
        resumeUrl: user.resume_url
      })

    } catch (err) {

      console.error(err)
      res.status(500).json({ message: "Failed to fetch user" })

    }

  })


  // =========================
  // UPDATE USER PROFILE
  // =========================
  app.put("/api/users/profile", isAuthenticated, async (req: any, res: any) => {

    try {

      const userId = req.user.id

      const {
        firstName,
        lastName,
        department,
        year,
        skills,
        bio,
        githubUrl,
        resumeUrl
      } = req.body

      await pool.query(
        `UPDATE users 
        SET first_name=$1,
            last_name=$2,
            department=$3,
            year_of_study=$4,
            skills=$5,
            bio=$6,
            github_url=$7,
            resume_url=$8
        WHERE id=$9`,
        [
          firstName,
          lastName,
          department,
          year,
          skills,
          bio,
          githubUrl,
          resumeUrl,
          userId
        ]
      )

      res.json({ message: "Profile updated successfully" })

    } catch (error) {

      console.error(error)
      res.status(500).json({ message: "Failed to update profile" })

    }

  })

  // =========================
  // CREATE PROJECT
  // =========================
  app.post("/api/projects", isAuthenticated, async (req: any, res: any) => {

    try {

      const userId = req.user.id;
      const { title, description } = req.body;

      const result = await pool.query(
        `INSERT INTO projects (title, description, owner_id)
        VALUES ($1,$2,$3)
        RETURNING *`,
        [title, description, userId]
      );

      res.json(result.rows[0]);

    } catch (error) {

      console.error(error);
      res.status(500).json({ message: "Failed to create project" });

    }

  });

  // =========================
  // GET ALL PROJECTS
  // =========================
  app.get("/api/projects", async (req, res) => {

    try {

      const result = await pool.query(
        `SELECT * FROM projects ORDER BY created_at DESC`
      );

      res.json(result.rows);

    } catch (error) {

      console.error(error);
      res.status(500).json({ message: "Failed to fetch projects" });

    }

  });

  //SINGLE PROJECT DETAILS
  app.get("/api/projects/:id", async (req, res) => {
    const result = await pool.query(
      `SELECT * FROM projects WHERE id=$1`,
      [req.params.id]
    );

    res.json(result.rows[0]);
  });

  return httpServer
}