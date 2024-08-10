import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
  });
  const [loading, setLoading] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const userForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://authenticator-server.vercel.app/auth/forgot-password",
        user
      );
      console.log(response);
      if (response.data) {
        toast.success("Forgot password link sent successfully!");
        navigate("/signin");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="py-16">
      <div className="flex bg-white dark:bg-neutral-200 rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl mt-10 ">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?w=740&t=st=1723280918~exp=1723281518~hmac=c43ca54657fb862b6554cf9fe29129494ea9e42fe8ddbebfd2929691c21ddeaf')",
            width: "42%",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Authenticator
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <a href="#" className="text-xs text-center text-gray-500 uppercase">
              {" "}
              forget password
            </a>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              name="username"
              placeholder="Enter Your Username"
            />
          </div>

          <div className="mt-8">
            <button
              onClick={userForgotPassword}
              disabled={buttonDisabled}
              className={`bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600  buttonDisabled ? "cursor-not-allowed opacity-50" : ""
                    }`}
            >
              Click Me
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <p
              className="text-xs text-gray-500 uppercase cursor-pointer hover:text-cyan-600"
              onClick={() => {
                navigate("/signin");
              }}
            >
              or sign in
            </p>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
