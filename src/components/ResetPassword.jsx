import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API } from "./Global";
import "./AuthCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Formik Validations for React Input for password & confirmPassword
const formValidationSchema = yup.object({
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

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords do not match"),
});

// Reset password function
const ResetPassword = () => {
  const { _id, token } = useParams();
  const [data, setData] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false); // State to track reset success
  const navigate = useNavigate();

  // Fetch data from API to check if user exists
  const getInfo = async () => {
    try {
      const response = await fetch(
        `${API}/auth/reset-password/${_id}/${token}`,
        {
          method: "GET",
        }
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      toast.error("Failed to fetch user info. Please try again.");
    }
  };

  useEffect(() => {
    getInfo();
  }, []); // Empty dependency array ensures this runs only once.

  // Formik function to handleSubmit
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (reset) => {
      console.log("onsubmit", reset);
      resetPassword(reset);
    },
  });

  // Fetch to POST data to API and display response through React Toastify
  const resetPassword = async (reset) => {
    const id = toast.loading("Please wait...");
    console.log("resetPassword", reset);
    try {
      const response = await fetch(
        `${API}/auth/reset-password/${_id}/${token}`,
        {
          method: "POST",
          body: JSON.stringify(reset),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      toast.update(id, {
        render: data.message,
        type:
          data.message === "Reset password successful. Please Login"
            ? "success"
            : "error",
        isLoading: false,
        autoClose: 5000,
      });

      if (data.message === "Reset password successful. Please Login") {
        setResetSuccess(true);
      }
    } catch (error) {
      toast.update(id, {
        render: "An error occurred. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error("Failed to reset password:", error);
    }
  };

  // Use useEffect to navigate back to login page after 3 seconds of reset success
  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);

      // Clear the timer on component unmount to avoid memory leak
      return () => clearTimeout(timer);
    }
  }, [resetSuccess, navigate]);

  return (
    <div className="ResetPassword container-lg">
      <div className="forgotPassword container-lg">
        {/* Toastify */}
        <ToastContainer />
        <div className="container-lg">
          <div className="Auth mx-auto col">
            <div className="card">
              {/* Heading */}
              <div className="card-heading">React Authentication</div>
              {/* Logo */}
              <img className="logo" src="/logo/logo192.png" alt="applogo" />
              {/* Card Body */}
              <div className="cardbody">
                <div className="form-wrapper col">
                  <form onSubmit={formik.handleSubmit} className="form">
                    <p>Reset Password for {data.email}</p>
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
                        {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? formik.errors.confirmPassword
                          : ""}
                      </p>
                      <label>Confirm Password</label>
                    </div>
                    <button type="submit" className="button1">
                      Reset Password
                    </button>
                    <div className="mt-3">
                      <h6 className="login">
                        <Link to="/login" className="link">
                          Back to Login
                        </Link>
                      </h6>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
