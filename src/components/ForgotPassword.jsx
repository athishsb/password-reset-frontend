import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { API } from "./Global";
import "./AuthCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formValidationSchema = yup.object({
  email: yup
    .string()
    .min(5, "Please enter a valid email address")
    .max(30, "Enter an alternate email address")
    .required("Please provide a email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid format"),
});

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (user) => {
      console.log("onsubmit", user);
      forgotPassword(user);
    },
  });

  const forgotPassword = (user) => {
    const id = toast.loading("Please wait...");
    console.log("createUser", user);
    fetch(`${API}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.update(id, {
          render: data.message,
          type: data.message.includes(
            "Password reset mail has been sent successfully"
          )
            ? "success"
            : "error",
          isLoading: false,
          autoClose: 5000,
        });
      })
      .catch((err) => {
        toast(err.message);
      });
  };

  return (
    <div className="forgotPassword container-lg">
      <div className="container-lg">
        {/* Toastify */}
        <ToastContainer />
        <div className="Auth mx-auto col">
          <div className="card">
            {/* Heading */}
            <div className="card-heading">React Authentication</div>
            {/* Logo */}
            <img className="logo" src="/logo/logo192.png" alt="applogo" />
            {/* Card Body */}
            <div className="cardbody">
              <div className="form-wrapper col">
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
                  <button type="submit" className="button2">
                    Reset Password
                  </button>
                  <h6 className="login">
                    <Link to="/login" className="link">
                      Back to Login
                    </Link>
                  </h6>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
