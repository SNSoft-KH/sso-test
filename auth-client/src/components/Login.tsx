// src/components/Login.js
import React, { useState, useEffect } from "react";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // 检查cookie是否存在
    const cookies = document.cookie.split(";");
    console.log("🚀 ~ useEffect ~ cookies:", cookies)
    const hasAuthCookie = cookies.some(
      (cookie) =>
        cookie.trim().startsWith("test_refresh_token=")
    );

    if (hasAuthCookie) {
      const redirectUrl =
        new URLSearchParams(window.location.search).get("redirect") || "/";
      window.location.href = redirectUrl;
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(userId, password);
    try {
      // Make API call to NestJS backend to login
      const response = await fetch("http://localhost:8000/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          password,
        }),
      });

      // I want to store the access_token in the sub domain of the current domain
      // localStorage.setItem("access_token", data?.accessToken); // Store JWT token in local storage
      if (response.ok) {
        const redirectUrl = new URLSearchParams(window.location.search).get(
          "redirect"
        );
        window.location.href = redirectUrl || "/login";
      }
      setError("");
    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Id:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
        <a
          href={`/register?redirect=${
            new URLSearchParams(window.location.search).get("redirect") || "/"
          }`}
        >
          new user?
        </a>
      </form>
    </div>
  );
};

export default Login;
