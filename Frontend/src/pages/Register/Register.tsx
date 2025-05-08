import React, { FormEvent, useContext } from "react";
import { Avatar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { GlobalStateContext } from "../../components/ContextApi/GlobalStateProvide";

const Register = () => {
  const [name, setName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  // const [avatar,setAvatar] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  const { avatar, setAvatar } = context;

  const navigate = useNavigate();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.error("No file selected"); // Optional: Log or handle the error
      return; // Exit if no file is selected
    }
    const Reader = new FileReader();

    Reader.onload = () => {
      if (Reader.readyState == 2) {
        const result = Reader.result;
        if (typeof result === "string") {
          setAvatar(result); // Only call setAvatar if result is a string
        }
      }
    };
    Reader.readAsDataURL(file);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:8000/api/v1/user/register",
      { name, phone, password, avatar },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response) {
      navigate("/api/v1/user/login");
    }
  };

  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <Typography
          variant="h3"
          style={{ padding: "2vmax", fontWeight: "600" }}
        >
          Register
          <span
            style={{ marginLeft: "5px", color: "skyBlue", fontWeight: "500" }}
          >
            ChitChat
          </span>
        </Typography>

        <Avatar
          src={avatar}
          alt="User"
          sx={{ height: "6vmax", width: "6vmax" }}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <input
          type="text"
          className="registerInputs"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="phone"
          className="registerInputs"
          placeholder="phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          className="registerInputs"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/api/v1/user/login">
          <Typography style={{color:'black'}}>Already Signed Up? Login Now</Typography>
        </Link>

        <Button type="submit" style={{color: 'skyblue'}}>Sign Up</Button>
      </form>
    </div>
  );
};

export default Register;
