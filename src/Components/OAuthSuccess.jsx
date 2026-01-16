import { useEffect } from "react";

const OAuthSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (userId) {
      // store userId (or token later)
      localStorage.setItem("userId", userId);

      // 🔥 HARD redirect (full page reload)
      window.location.href = "/dashboard";
    }
  }, []);

  return <p>Logging you in with Google...</p>;
};

export default OAuthSuccess;
