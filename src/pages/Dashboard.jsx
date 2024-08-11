import { useSelector } from "react-redux";

const Dashboard = () => {

  const { user } = useSelector((state) => state.auth);
  

  return (
    <>
      <div className="flex justify-center items-center h-[calc(100vh-56px)] text-6xl bolder">
        Hello, {user?.data?.user?.name}! Welcome to the dashboard
      </div>
    </>
  );
};

export default Dashboard;
