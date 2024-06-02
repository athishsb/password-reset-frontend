import { useState } from "react";
import { Link } from "react-router-dom";
import { Login } from "./Login";
import { Signup } from "./Signup";
import "./AuthCard.css";

export const AuthCard = () => {
  // To toggle between signup and login screen
  const [register, setRegister] = useState(false);

  return (
    <div className="container-lg">
      <div className="Auth mx-auto col">
        <div className="card">
          {/* Heading */}
          <div className="card-heading">React Authentication</div>
          {/* Logo */}
          <img className="logo" src="/logo/logo192.png" alt="applogo" />
          {/* Card Body */}
          <div className="cardbody">
            {register ? <Signup /> : <Login />}
            <h6 className="NewUserReg">
              <Link className="link" onClick={() => setRegister(!register)}>
                {register
                  ? "Already have a account? Login Here "
                  : "Sign up for a new account"}
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};
