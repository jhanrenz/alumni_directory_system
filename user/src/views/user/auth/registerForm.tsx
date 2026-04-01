import React, { useState, type FormEvent, type ReactNode, useEffect } from "react";
import { useRegisterUser } from "../../../hooks/auth/userAuth";
import type { Register } from "../../../types/user";
import { useNavigate, Link } from "react-router-dom";
import { useFetchCourses } from "../../../hooks/useCourse";
import axios, { AxiosError } from "axios";
import { X, User, Mail, Lock } from "lucide-react";
import backgroundImage from "./psubg.jpg";

const RegisterForm = () => {
  const [data, setData] = useState<Register>({
    name: "",
    email: "",
    password: "",
    course_id: "" as unknown as number,
    year: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const registerMutation = useRegisterUser();
  const { data: courses } = useFetchCourses();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setData(prev => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await registerMutation.mutateAsync(data);
      if (res.user) navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ errors?: Record<string, string[]> }>;
        if (axiosErr.response?.data?.errors) {
          const firstKey = Object.keys(axiosErr.response.data.errors)[0];
          setError(axiosErr.response.data.errors[firstKey][0]);
        } else {
          setError("Register failed. Please try again.");
        }
      } else {
        setError("Register failed. Please try again.");
      }
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 z-10"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Full Name">
            <Input
              icon={<User size={18} />}
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </FormGroup>

          <FormGroup label="Email">
            <Input
              icon={<Mail size={18} />}
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </FormGroup>

          <FormGroup label="Password">
            <Input
              icon={<Lock size={18} />}
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              placeholder="********"
            />
          </FormGroup>

          <FormGroup label="Course">
            <select
              name="course_id"
              value={data.course_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">Select Course</option>
              {courses?.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Year Graduated">
            <Input
              name="year"
              type="number"
              value={data.year}
              onChange={handleChange}
              placeholder="2025"
            />
          </FormGroup>

          <FormGroup label="Profile Image" className="md:col-span-2">
            <input type="file" onChange={handleFileChange} className="w-full mb-2" />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            )}
          </FormGroup>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all"
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const Input = ({ icon, ...props }: InputProps) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
    )}
    <input
      {...props}
      className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
    />
  </div>
);

interface FormGroupProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const FormGroup = ({ label, children, className }: FormGroupProps) => (
  <div className={`mb-4 ${className || ""}`}>
    <label className="block text-sm font-medium mb-1 text-gray-200">{label}</label>
    {children}
  </div>
);

export default RegisterForm;