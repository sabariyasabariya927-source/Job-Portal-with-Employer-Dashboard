import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login button clicked");
    console.log("Email:", email);

    try {
      const res = await axios.post(
        "http://localhost:8081/api/users/login",
        {
          email: email,
          password: password
        }
      );

      console.log("Backend response:", res.data);

      if (res.data.success) {
        alert("Login Success: " + res.data.role);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        alert("Login failed: " + error.response.data.message);
      } else {
        alert("Backend connection failed");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login Page</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;