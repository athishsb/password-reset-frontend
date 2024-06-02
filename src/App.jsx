import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthCard } from "./components/AuthCard";
import ForgotPassword from "./components/ForgotPassword";
import { NotFoundPage } from "./components/NotFoundPage";
import ResetPassword from "./components/ResetPassword";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <div className="App">
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthCard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:_id/:token" element={<ResetPassword />} />
          <Route path="/login" element={<Navigate replace to="/" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
