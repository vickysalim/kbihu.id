import { dataTableStyle } from "@/lib/dataTable/style";
import { formatDate, formatDateWithTime } from "@/lib/date/format";
import Alert from "@/views/components/Alert";
import Loader from "@/views/components/Loader";
import DashboardLayout from "@/views/layouts/DashboardLayout";
import { faCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";

const DashboardSuggestionBox: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);

  const [user, setUser] = useState({
    id: null,
    username: null,
    phone_number: null,
    role: null,
    company_id: null,
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

      if (response.data.data.role != "Admin") {
        window.location.href = "/dashboard";
      } else {
        setUser(response.data.data);
        setIsAuth(true);
      }
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
  };

  const [loading, setLoading] = useState(true);

  const suggestionBoxModel = {
    id: "",
    description: "",
    is_mark: "",
    created_at: "",
  };

  const [suggestionBox, setSuggestionBox] = useState([suggestionBoxModel]);

  const getSuggestionBox = async () => {
    try {
      await axios
        .get(`/api/suggestion/get/${user.company_id}`)
        .then((response) => {
          setSuggestionBox(response.data.data);
          setLoading(false);
        });
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMark = async (id: string) => {
    if (
      confirm(
        "Apakah anda yakin ingin mengubah status saran ini menjadi telah dibaca? Tindakan ini tidak dapat dibatalkan"
      )
    ) {
      try {
        await axios
          .put("/api/suggestion/updateMark", {
            id: id,
          })
          .then((res) => {
            setMessage(res.data.message);
            getSuggestionBox();
          });
      } catch (error: any) {
        if (error.response) {
          if (error.response.data.message[0].message)
            setMessage(`Error: ${error.response.data.message[0].message}`);
          else setMessage(`Error: ${error.response.data.message}`);
        } else {
          setMessage(`Unknown Error`);
        }
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Aksi",
        cell: (row: any) => {
          return (
            <button
              type="button"
              className="bg-blue-500 text-white enabled:active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleMark(row.id)}
              disabled={row.is_mark == 1}
            >
              <FontAwesomeIcon icon={faCheck} />
              <span className="ml-1">Tandai Telah Dibaca</span>
            </button>
          );
        },
        width: "300px",
      },
      {
        name: "Deskripsi",
        cell: (row: any) => {
          return row.description;
        },
      },
      {
        name: "Tanggal",
        cell: (row: any) => {
          return formatDateWithTime(row.created_at);
        },
      },
    ],
    [handleMark]
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.href = "/auth/login";
    else {
      if (!isAuth) checkToken();
    }

    getSuggestionBox();
  }, [isAuth, user]);

  const tableStyle: {} = dataTableStyle;

  if (loading || !isAuth) return <Loader />;
  return (
    <DashboardLayout pageName="Kotak Saran" role={user.role}>
      <div className="mt-4 mb-4">
        {message && (
          <Alert type={message.includes("Error") ? "error" : "success"}>
            {message}
          </Alert>
        )}
      </div>

      {suggestionBox.length > 0 ? (
        <DataTable
          columns={columns}
          data={suggestionBox}
          pagination={true}
          customStyles={tableStyle}
        />
      ) : (
        "Belum ada data kritik atau saran"
      )}
    </DashboardLayout>
  );
};

export default DashboardSuggestionBox;
