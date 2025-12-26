"use client";

import { useState } from "react";

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/auth/login", { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to initiate login");
      }

      const { authUrl } = await response.json();

      // Redirect to Plex auth page
      window.location.href = authUrl;
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to Plex. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="flex items-center gap-3 rounded-lg bg-[#E5A00D] px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-[#F5B020] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 hover:cursor-pointer"
        type="button"
      >
        {isLoading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5l7.5 7.5-7.5 7.5-7.5-7.5L12 4.5z" />
            </svg>
            Sign in with Plex
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
