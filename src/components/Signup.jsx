import { useFormik } from "formik";
import * as yup from "yup";
import { API } from "./Global";
import "./AuthCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Formik Validation for React Input for username,email,password & confirmPassword
const formValidationSchema = yup.object({
  username: yup
    .string()
    .min(3, "Please enter a valid username")
    .required("Please enter your username"),

  email: yup
    .string()
    .min(5, "Please enter a valid email address")
    .max(30, "Enter an alternate email address")
    .required("Please provide a email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid format"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Character limit exceeded")
    .required("Please enter your password")
    .matches(/\d/, "Password must contain atleast one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain atleast one special character"
    ),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords doesnot match"),
});

// Export signup function
export const Signup = () => {
  const navigate = useNavigate();
  // Formik function to handleSubmit
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (newUser) => {
      console.log("onsubmit", newUser);
      createUser(newUser);
    },
  });

  // Fetch to POST data to API and display response through React Toastify
  const createUser = (newUser) => {
    const id = toast.loading("Please wait...");
    fetch(`${API}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.update(id, {
          render: data.message,
          type:
            data.message === "Signup successful.Please login"
              ? "success"
              : "error",
          isLoading: false,
          autoClose: 5000,
        });
      })
      .then(() => {
        setTimeout(() => {
          navigate("/login");
        }, 6000);
      })
      .catch((err) => {
        toast(err.message);
      });
  };

  return (
    <div className="form-wrapper col">
      {/* Toastify */}
      <ToastContainer />
      <form onSubmit={formik.handleSubmit} className="form">
        {/* Register */}
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <p className="error">
            {formik.touched.username && formik.errors.username
              ? formik.errors.username
              : ""}
          </p>
          <label className="form-label">Username</label>
        </div>
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
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <p className="error">
            {formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : ""}
          </p>
          <label>Confirm Password</label>
        </div>
        <button type="submit" className="button1">
          Sign up
        </button>
      </form>
    </div>
  );
};
