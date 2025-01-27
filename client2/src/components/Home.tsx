import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { REACT_APP_AUTH_CLIENT_URL } from "../constants";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other properties as needed
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const accessToken = localStorage.getItem("test_access_token");

        if (accessToken) {
          // 如果有 access token，尝试获取用户信息
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          const meResponse = await axiosInstance.get("/auth/me");
          console.log("🚀 ~ checkAuth ~ meResponse:", meResponse);
          setUser(meResponse.data);
        } else {
          // 如果没有 access token，尝试刷新
          const refreshResponse = await axiosInstance.get("/auth/refresh");
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem("test_access_token", newAccessToken);

          // 使用新的 token 获取用户信息
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          const meResponse = await axiosInstance.get("/auth/me");
          setUser(meResponse.data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // 如果刷新失败，重定向到登录页面
          // const authClientUrl =
          //   REACT_APP_AUTH_CLIENT_URL || "http://localhost:3000";
          // window.location.href = `${authClientUrl}/login?redirect=${window.location.href}`;
        }
        setUser(null);
      }
    }

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      console.log("Logout started");
      // 调用后端登出接口
      await axiosInstance.post("/auth/sign-out");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // 无论是否成功都清除本地存储和状态
      localStorage.removeItem("test_access_token");
      setUser(null);
    }
  };

  return (
    <div>
      <h1>Welcome to the React App!</h1>
      {user ? (
        <>
          <p>
            You are logged in as <strong>{user.name}</strong>.
          </p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>
          You are not logged in. Please{" "}
          <a
            href={`${REACT_APP_AUTH_CLIENT_URL}/login?redirect=${window.location.href}`}
          >
            log in
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default Home;
