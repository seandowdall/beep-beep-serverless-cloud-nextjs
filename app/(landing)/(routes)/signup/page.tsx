// use client
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Signup() {
  const [hidePassword, setHidePassword] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up.");
      }

      // Handle successful signup, e.g., redirect or display a success message
      alert(
        "Signup successful! Please check your email to confirm your account."
      );
      location.replace("/login"); // Redirect to login page
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[300px] mx-auto sm:w-full z-10"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs">
            Email
          </label>
          <input
            className="p-2 rounded-[5px] text-darkTextColor dark:text-lightTextColor shadow-small"
            name="email"
            id="email"
            type="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-xs">
            Username
          </label>
          <input
            className="p-2 rounded-[5px] text-darkTextColor dark:text-lightTextColor shadow-small"
            name="username"
            id="username"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-xs">
            Password
          </label>
          <div className="relative">
            <input
              className="p-2 rounded-[5px] w-full pr-8 text-darkTextColor dark:text-lightTextColor shadow-small"
              name="password"
              id="password"
              type={hidePassword ? "password" : "text"}
            />
            <button
              type="button"
              onClick={() => setHidePassword(!hidePassword)}
              className="absolute top-1/2 -translate-y-1/2 right-0 my-auto mr-[10px] hover:scale-110 transition duration-200"
            >
              {hidePassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          className="p-2 bg-detailsColor text-lightTextColor rounded-[5px] hover:scale-105 transition duration-200 shadow-small"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
