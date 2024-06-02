import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { API } from "./Global";
import "./AuthCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Formik Validations for React Input for email & password
const formValidationSchema = yup.object({
  email: yup
    .string()
    .min(5, "Please enter a valid email address")
    .max(30, "Enter an alternate email address")
    .required("Please provide an email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid format"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Character limit exceeded")
    .required("Please enter your password")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

// Login Function
export const Login = () => {
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        navigate("/profile");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loginSuccess, navigate]);

  // Formik function to handleSubmit
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (user) => {
      loginUser(user);
    },
  });

  // Fetch to POST data to API and display response through React Toastify
  const loginUser = (newUser) => {
    const id = toast.loading("Please wait...");
    fetch(`${API}/auth/login`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.update(id, {
          render: data.message,
          type: data.message === "Login successful" ? "success" : "error",
          isLoading: false,
          autoClose: 5000,
        });

        if (data.message === "Login successful") {
          setLoginSuccess(true);
          // Save the token and username in local storage
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
        }
      })
      .catch((err) => {
        toast(err.message);
      });
  };

  return (
    <div className="form-wrapper col">
      {/* Toastify */}
      <ToastContainer />
      <form className="form" onSubmit={formik.handleSubmit}>
        {/* Login */}
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <p className="error">
            {formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""}
          </p>
          <label>Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <p className="error">
            {formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""}
          </p>
          <label>Password</label>
        </div>
        <button type="submit" className="button2">
          Login
        </button>
        <h6 className="Reset-Password">
          <Link to="/forgot-password" className="link">
            Forgot Password
          </Link>
        </h6>
      </form>
    </div>
  );
};
