import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // automatically sets host/port
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_PASS, // your Gmail App Password (16 chars)
  },
  tls: {
    rejectUnauthorized: false, // 👈 bypass cert errors
  },
});

// ----------------- SEND RESET OTP -----------------
export const sendResetOtpEmail = async (to, name, otp) => {
  try {
    await transporter.sendMail({
      from: `"Your App Support" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Your Password Reset OTP",
      html: `
        <p>Hello <b>${name}</b>,</p>
        <p>You requested to reset your password. Please use the OTP below:</p>
        
        <h2 style="color:#2d89ef; letter-spacing:3px;">${otp}</h2>
        
        <p>This OTP will expire in <b>10 minutes</b>.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        
        <br/>
        <p>— The Support Team</p>
      `,
    });
    console.log("OTP email sent successfully");
  } catch (err) {
    console.error("SMTP Error:", err);
    throw new Error("Failed to send OTP email");
  }
};
