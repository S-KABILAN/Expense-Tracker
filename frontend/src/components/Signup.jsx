import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "./ThemeContext";
import { register, googleLogin } from "../services/authService";
import { motion } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSignup = async (e) => {
    e?.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({ name, email, password });
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      await googleLogin(credentialResponse.credential);
      setSuccess("Google sign-in successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.error("Google Sign-In failed:", error.message);
      setError("Google Sign-In was unsuccessful. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-5 text-white">
            <h1 className="text-2xl font-display font-bold text-center mb-1">
              Expense Tracker
            </h1>
            <p className="text-white/80 text-center text-sm">
              Join today and take control of your finances
            </p>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-display font-semibold text-gray-800 dark:text-white text-center mb-5">
              Create Your Account
            </h2>

            {error && (
              <div className="mb-4 p-2 bg-danger-50 text-danger-700 dark:bg-danger-900 dark:text-danger-300 rounded-lg text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-xs">
                {success}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label htmlFor="name" className="label text-xs mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input py-2 text-sm placeholder:text-gray-400 placeholder:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="label text-xs mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input py-2 text-sm placeholder:text-gray-400 placeholder:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="label text-xs mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input py-2 text-sm placeholder:text-gray-400 placeholder:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label text-xs mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input py-2 text-sm placeholder:text-gray-400 placeholder:text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex justify-center items-center h-10 mt-2 text-sm"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="mt-5">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
                <div className="px-3 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 z-10 mx-2">
                  or
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
              </div>

              <div className="mt-3">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  type="standard"
                  theme={darkMode ? "filled_black" : "outline"}
                  size="medium"
                  width="100%"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
