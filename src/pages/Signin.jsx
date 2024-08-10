import React, { useEffect, useState } from "react";

import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { setUserData } from "../redux/authSlice";

const Signin = () => {
  const { authenticated, setAuthenticated } = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const onLogin = async () => {
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    try {
      setLoading(true);
      setButtonDisabled(true);

      const response = await axios.post(
        "https://authenticator-server.vercel.app/auth/login",
        {
          ...user,
          recaptchaToken,
        }
      );

      if (response?.data) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        toast.success("Login successful");

        // Update global state and redirect
        dispatch(setUserData(response.data));
        setAuthenticated(true); // Assuming you have a setAuthenticated function
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  useEffect(() => {
    if (user.username.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated]);

  const apiKey = import.meta.env.VITE_SITE_KEY;
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div></div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {/* {loading ? "Processing" : "Sign In"} */}
              Sign In
            </h1>
            <div className="w-full flex-1 mt-4">
              <div className="my-8 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  sign in with username
                </div>
              </div>
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  placeholder="Username"
                />

                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="Password"
                />
                <div className="mt-4">
                  <div className="flex justify-between">
                    <ReCAPTCHA
                      sitekey={apiKey}
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                </div>
                <button
                  onClick={onLogin}
                  disabled={buttonDisabled}
                  className={`mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                    buttonDisabled ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy={7} r={4} />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">
                    {" "}
                    {buttonDisabled ? "Fill All Details" : "Sign In"}
                  </span>
                </button>

                <div className="my-8 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Donot have an account?{" "}
                    <a href="/signup" className="text-indigo-500">
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg")',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
