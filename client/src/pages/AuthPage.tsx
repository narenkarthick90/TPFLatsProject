import { useState } from "react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  async function sendOtp() {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setOtpSent(true);
      alert("OTP sent to email");
    } else {
      alert("Invalid email");
    }
  }

  async function verifyOtp() {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });

    if (res.ok) {
      setLocation("/projects");
    } else {
      alert("Invalid OTP");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="p-8 border rounded-lg w-96 space-y-4">

        {!otpSent && (
          <>
            <h2 className="text-xl font-bold">Login with NITT Email</h2>

            <input
              className="border p-2 w-full"
              placeholder="rollno@nitt.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="bg-blue-500 text-white p-2 w-full"
              onClick={sendOtp}
            >
              Send OTP
            </button>
          </>
        )}

        {otpSent && (
          <>
            <h2 className="text-xl font-bold">Enter OTP</h2>

            <input
              className="border p-2 w-full"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="bg-green-500 text-white p-2 w-full"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

      </div>

    </div>
  );
}