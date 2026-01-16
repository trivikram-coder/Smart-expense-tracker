import { useEffect } from "react";

const OAuthSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (userId) {
      localStorage.setItem("userId", userId);

      // hard reload + redirect
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-3 shadow-sm">
        {/* spinner */}
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>

        <p className="text-sm font-medium text-gray-700">
          Signing you in…
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
