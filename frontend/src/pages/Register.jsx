import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formHandler = async (e) => {
    e.preventDefault();
    setError("");

    // Form data extraction
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // Extracted accessToken from API response wrapper
      const token = res.data?.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data?.data?.user));
      }

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
  <div className="w-full max-w-sm">
    
    {/* Header */}
    <div className="mb-10 text-center">
      <h1 className="text-2xl font-semibold tracking-wide text-black dark:text-white">
        CREATE ACCOUNT
      </h1>
      <p className="text-xs text-gray-500 mt-2">
        Join us and start organizing
      </p>
    </div>

    {error && (
      <div className="mb-6 text-sm text-red-500 border-b border-red-300 pb-2">
        {error}
      </div>
    )}

    <form className="space-y-6" onSubmit={formHandler}>
      
      {/* Name */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="FULL NAME"
          required
          className="w-full border-b border-gray-300 bg-transparent py-2 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition"
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="EMAIL"
          required
          className="w-full border-b border-gray-300 bg-transparent py-2 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition"
        />
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          name="password"
          placeholder="PASSWORD"
          required
          className="w-full border-b border-gray-300 bg-transparent py-2 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition"
        />
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 leading-relaxed">
        By creating an account, you agree to our{" "}
        <span className="underline cursor-pointer">Terms & Conditions</span>.
      </p>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full border border-black dark:border-white py-3 text-sm font-medium tracking-wide text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition disabled:opacity-40"
      >
        {loading ? "CREATING..." : "CREATE ACCOUNT"}
      </button>
    </form>

    {/* Footer */}
    <div className="mt-10 text-center">
      <p className="text-xs text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="underline text-black dark:text-white">
          LOG IN
        </Link>
      </p>
    </div>

  </div>
</div>
  );
};

export default Register;

