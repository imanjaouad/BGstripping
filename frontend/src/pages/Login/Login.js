import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/Login.css";

import Navbar from "../Home/navBare";
import Header from "../Home/Header";
import Footer from "../Home/Footer";

import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import logo from "../../images/logo.png";

export default function Login() {

  const navigate = useNavigate();

  const [showPassword,setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/login",
        {
          username: formData.username,
          password: formData.password
        }
      );

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      if (formData.remember) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data.user.role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
  console.log("ERROR:", error.response?.data);
  console.log("STATUS:", error.response?.status);
  alert("Login incorrect");
}
  };

  return (
    <>
    
      <Navbar/>
      <Header/>

      <div className="login-container">

        <form className="login-form" onSubmit={handleLogin}>

          <div className="logo-container">
            <img src={logo} alt="logo"/>
          </div>

          <h2>Se Connecter</h2>

          {/* USERNAME */}

          <div className="form-group">

            <label>Username</label>

            <div className="input-icon">

              <input
                type="text"
                placeholder="Nom d'utulisateur"
                onChange={(e)=>setFormData({...formData, username:e.target.value})}
                required
              />

              <FaUser className="icon"/>

            </div>

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>Password</label>

            <div className="input-icon">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                onChange={(e)=>setFormData({...formData, password:e.target.value})}
                required
              />

              <span
                className="icon"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash/> : <FaEye/>}
              </span>

            </div>

          </div>

          <div className="remember">
            <input
              type="checkbox"
              onChange={(e)=>setFormData({...formData, remember:e.target.checked})}
            />
            <label>Se souvenir de moi</label>
          </div>

          <button type="submit">
            Se Connecter
          </button>

        </form>

      </div>

      <Footer/>

    </>
  );
}