import Loader from "@/views/components/Loader";
import DashboardLayout from "@/views/layouts/DashboardLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminHelpDeskLayout from "@/views/layouts/AdminLayout/help";

const DashboardHelpDesk: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);

  const [user, setUser] = useState({
    id: "",
    username: "",
    phone_number: "",
    role: "",
    company_id: "",
  });

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "/api/auth/verify",
        {
          userData: "true",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data.role == "User") {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      } else {
        setUser(response.data.data);
        setIsAuth(true);
      }
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.href = "/auth/login";
    else {
      if (!isAuth) checkToken();
    }
  }, [isAuth, user]);

  return (
    <>
      {isAuth ? (
        <DashboardLayout pageName="Pusat Bantuan" role={user.role}>
          {user.role == "Superadmin" ? (
            <p>You are not authorized</p>
          ) : user.role == "Admin" ? (
            <AdminHelpDeskLayout />
          ) : (
            <p>You are not authorized</p>
          )}
        </DashboardLayout>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DashboardHelpDesk;
