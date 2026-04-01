import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock } from "lucide-react";
import backgroundImage from './psubg.jpg';
import axios,{AxiosError} from "axios";
import type { AdminLogin } from "../../../types/admin";
import { useLoginAdmin } from "../../../hooks/auth/adminAuth";

const LoginForm = () => {
  const [data, setData] = useState<AdminLogin>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null); // <-- new state for message
  const navigate = useNavigate();
  const loginMutation = useLoginAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    const res = await loginMutation.mutateAsync(data);
    if (res.user) navigate("/admin/dashboard");
  } catch (err: unknown) {  // <-- unknown instead of any
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ errors: { email?: string[] } }>;
      if (axiosErr.response?.data?.errors?.email) {
        setError(axiosErr.response.data.errors.email[0]);
        
      } else {
        setError("Login failed. Please try again.");
      }
    } else {
      setError("Login failed. Please try again.");
    }
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/90 p-8 rounded-lg shadow-lg w-full max-w-md z-10"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Welcome Admin Login
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative mb-6">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;