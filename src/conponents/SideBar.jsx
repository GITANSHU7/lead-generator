import axios from "axios";
import { Avatar, Dropdown, Navbar, useThemeMode } from "flowbite-react";
import { FaRegSun } from "react-icons/fa";
import { LuMoon } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { clearUserData } from "../redux/authSlice";

const SideBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toggleMode, mode } = useThemeMode();

  const { authenticated, setUserDetails } = useAuth();

  if (!authenticated) {
    return null;
  }

  const onLogout = async () => {
    try {
      const apiToken = user?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token"); // Throw error if no token
      }

      const response = await axios.post(
        "https://authenticator-server.vercel.app/auth/signout",
        null,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      // on sucessful logout, remove the user data from local storage
      localStorage.removeItem("userData");
      clearUserData();
      setUserDetails(null);
      window.location.href = "/signin";
    } catch (error) {
      console.error(error.message || "Error fetching user details");
    }
  };

  return (
    <>
      <Navbar fluid rounded className="bg-blue-400 dark:bg-slate-900">
        <Navbar.Brand>
          <span
            className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
            onClick={() => {
              navigate("/");
            }}
          >
            Authenticator
          </span>
        </Navbar.Brand>

        <div className="flex md:order-2">
          <span
            className="cursor-pointer flex items-center mr-4"
            onClick={toggleMode}
          >
            {mode === "light" ? (
              <LuMoon size={"20"} className="text-white" />
            ) : (
              <FaRegSun size={"20"} className="text-yellow-300" />
            )}
          </span>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block truncate text-sm font-medium">
                {user?.data?.user?.username}
              </span>
            </Dropdown.Header>

            <Dropdown.Item onClick={onLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
    </>
  );
};

export default SideBar;
