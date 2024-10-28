import React, {useState, useEffect} from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          email: email,
          password: password,
        }
      );

      console.log(response);
      console.log(response.data);

      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setError("Login failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-slate-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-slate-600 rounded-md"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}
        
        <p>
        <a
            to="/register"
            className="text-slate-600 hover:text-slate-600 hover:underline"
          >
            Forgot password?
          </a>
        </p>

        <p>
          Don't have an account?{" "}
          <a
            to="/register"
            className="text-slate-600 hover:text-slate-600 hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </section>
  );
}

export default Login;