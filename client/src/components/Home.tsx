import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { FPMS_ACCESS_TOKEN_NAME, FPMS_REFRESH_TOKEN_NAME, REACT_APP_AUTH_CLIENT_URL } from "../constants";

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
        const accessToken = localStorage.getItem(FPMS_ACCESS_TOKEN_NAME);
        let newAccessToken;
        const hasAuthCookie = isCookieExist()
        // if cookie exist and access token is invalid
        console.log(
          "🚀 ~ checkAuth ~ hasAuthCookie:",
          hasAuthCookie,
          accessToken
        );
        if (!accessToken && hasAuthCookie) {
          // 如果没有 access token，尝试刷新
          newAccessToken = await refreshToken();
        }
        console.log("🚀 ~ checkAuth ~ newAccessToken:", newAccessToken);
        // 使用新的 token 获取用户信息
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken || newAccessToken}`;
        const meResponse = await axiosInstance.get("/auth/me");
        setUser(meResponse.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const hasAuthCookie = isCookieExist()
        if (hasAuthCookie && error.response && error.response.status === 401) {
          // 如果刷新失败，重定向到登录页面
          const newAccessToken = await refreshToken();
          console.log("🚀 ~ checkAuth ~ newAccessToken:", newAccessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          const meResponse = await axiosInstance.get("/auth/me");
          setUser(meResponse.data);
          return;
        }
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const isCookieExist = () => {
    const cookies = document.cookie.split(";");
    return cookies.some((cookie) =>
      cookie.trim().startsWith(`${FPMS_REFRESH_TOKEN_NAME}=`)
    );
  };
  const refreshToken = async () => {
    const refreshResponse = await axiosInstance.get("/auth/refresh");
    console.log("🚀 ~ refreshToken ~ refreshResponse:", refreshResponse);
    const newAccessToken = refreshResponse.data.accessToken;
    localStorage.setItem(FPMS_ACCESS_TOKEN_NAME, newAccessToken);
    return newAccessToken;
  };

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
      localStorage.removeItem(FPMS_ACCESS_TOKEN_NAME);
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
            href={`${REACT_APP_AUTH_CLIENT_URL}/sign-in?redirect=${window.location.href}`}
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
