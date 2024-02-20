import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let handleRegister = async (e) => {
    try {
      const reqBody = JSON.stringify({
        user: {
          username,
          password,
        },
      });
      if (!reqBody) return;
      let res = await fetch("http://localhost:5050/api/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: reqBody,
      });
      const formattedResponse = await res.json();
      console.log(formattedResponse);

      if (res.status === 200) {
        setUsername("");
        setPassword("");
        alert("Registration is successfull");
      } else {
        alert(formattedResponse);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="form-container">
      <form
        className="form"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <label htmlFor="username">Enter your username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Enter your password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={(e) => handleRegister(e)}>
          Register
        </button>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Navigate to Login
        </button>
      </form>
    </div>
  );
}

export default Register;
