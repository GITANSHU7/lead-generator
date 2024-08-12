import axios from "axios";
import { Popover, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const userSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://authenticator-server.vercel.app/auth/signup",
        user
      );
      console.log(response);
      if (response.data.success) {
        toast.success("User created successfully! Please login to continue");
        navigate("/signin");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.name.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-700 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div></div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {loading ? "Processing" : "Sign Up"}
            </h1>
            <div className="w-full flex-1 mt-4">
              <div className="my-8 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Fill in your details
                </div>
              </div>
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 m-1 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  name="name"
                  placeholder="Enter your name"
                />
                <input
                  className="w-full px-8 py-4 m-1 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  name="username"
                  placeholder="Enter Your Username"
                />
                <Popover
                  trigger="hover"
                  content={
                    <div className="space-y-2 p-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Must have at least 7 characters
                      </h3>

                      <p className="dark:text-white">It’s better to have:</p>
                      <ul>
                        <li className="mb-1 flex items-center">
                          <svg
                            className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                          <span className="dark:text-white">
                            {" "}
                            1 Upper & 1 lower case letters
                          </span>
                        </li>
                        <li className="mb-1 flex items-center">
                          <svg
                            className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                          <span className="dark:text-white">
                            1 special character
                          </span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                          <span className="dark:text-white">1 Number</span>
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <input
                    className="w-full px-8 py-4 m-1 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    name="password"
                    placeholder="Enter Your Password"
                  />
                </Popover>
                {loading ? (
                  <>
                    {" "}
                    <div className="flex items-center justify-center mt-2">
                      <Spinner
                        className=""
                        aria-label="Extra large spinner example"
                        size="xl"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={userSignUp}
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
                  </>
                )}
                {/* <button
                  onClick={userSignUp}
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
                    {buttonDisabled ? "Fill All Details" : "Signup"}
                  </span>
                </button> */}

                <div className="my-8 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Already have an account?{" "}
                    <span
                      className="text-indigo-500 cursor-pointer"
                      onClick={() => {
                        navigate("/signin");
                      }}
                    >
                      Sign In
                    </span>
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
                'url("https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg?w=740&t=st=1717673341~exp=1717673941~hmac=93568f1ad819d0ac679f7db3768cfce6eb47e3e30bfb0bb03930548bf546982e")',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
