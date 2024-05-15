import { dataTableStyle } from "@/lib/dataTable/style";
import { downloadFile } from "@/lib/download";
import Alert from "@/views/components/Alert";
import Loader from "@/views/components/Loader";
import DashboardLayout from "@/views/layouts/DashboardLayout";
import {
  faDownload,
  faPencil,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";

const DashboardConfiguration: React.FC = () => {
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

  const scheduleModel = {
    id: "",
    file: "",
    year: "",
  };

  const [schedule, setSchedule] = useState([scheduleModel]);
  const [addSchedule, setAddSchedule] = useState(scheduleModel);

  const getSchedule = async () => {
    try {
      await axios
        .get(`/api/schedule/get/${user.company_id}`)
        .then((response) => {
          setSchedule(response.data.data);
          setLoading(false);
        });
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan"
      )
    ) {
      try {
        await axios
          .delete("/api/schedule/delete", {
            data: {
              id: id,
            },
          })
          .then((res) => {
            setMessage(res.data.message);
            getSchedule();
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
            <>
              {/* <button
                type="button"
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
              >
                <FontAwesomeIcon icon={faPencil} />
                <span className="ml-1">Edit</span>
              </button> */}
              <button
                type="button"
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
                onClick={() => handleDelete(row.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span className="ml-1">Hapus</span>
              </button>
            </>
          );
        },
        width: "200px",
      },
      {
        name: "Tahun Keberangkatan",
        cell: (row: any) => {
          return row.year;
        },
      },
      {
        name: "File",
        cell: (row: any) => {
          return (
            <button
              type="button"
              className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
              onClick={() => downloadPdf(row.file)}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span className="ml-1">Download</span>
            </button>
          );
        },
      },
    ],
    [handleDelete]
  );

  const downloadPdf = async (pdf_file: string) => {
    if (pdf_file)
      await downloadFile(`/upload_files/schedule/${pdf_file}`, pdf_file);
  };

  const [message, setMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const fileInputRef = useRef(null);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddSchedule({ ...addSchedule, file: file });
    }
  };

  const validateInsert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors = {};
    if (!addSchedule.year) {
      errors = { ...errors, year: "Tahun keberangkatan harus diisi" };
    }
    if (Object.keys(errors).length > 0) {
      setValidationMessage(errors);
    } else {
      setValidationMessage({});
      insertSchedule();
    }
  };

  const insertSchedule = async () => {
    const formData = new FormData();
    formData.append("id", user.company_id as unknown as string);
    formData.append("year", addSchedule.year);
    formData.append("file", addSchedule.file);
    try {
      await axios.post("/api/schedule/add", formData).then((response) => {
        setMessage(response.data.message);
        setAddSchedule(scheduleModel);
        getSchedule();
        if (fileInputRef.current) {
          (fileInputRef.current as HTMLInputElement).value = "";
        }
      });
    } catch (error: any) {
      if (error.response) {
        const fieldError = error.response.data.message;
        setMessage(`Error: ${fieldError}`);
      } else {
        setMessage(`Unknown Error`);
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.href = "/auth/login";
    else {
      if (!isAuth) checkToken();
    }

    getSchedule();
  }, [isAuth, user]);

  const tableStyle: {} = dataTableStyle;

  if (loading || !isAuth) return <Loader />;
  return (
    <DashboardLayout pageName="Manasik Haji" role={user.role}>
      <Disclosure>
        <Disclosure.Button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-1">Tambah Jadwal Manasik Haji</span>
        </Disclosure.Button>
        <Disclosure.Panel className="mt-2 text-gray-500 bg-white rounded-lg p-4">
          <form onSubmit={validateInsert}>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="year"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Tahun Keberangkatan
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={addSchedule.year}
                    onChange={(e) =>
                      setAddSchedule({ ...addSchedule, year: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {validationMessage.year && (
                    <p className="text-sm text-red-500">
                      {validationMessage.year}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="file"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Upload Jadwal Manasik Haji
                  </label>
                  <input
                    type="file"
                    id="file"
                    ref={fileInputRef}
                    onChange={handleInputFile}
                    className="bg-white p-2 w-full text-slate-500 text-sm rounded-lg leading-6 border border-gray-300 focus:border-blue-500 file:bg-blue-500 file:text-white file:font-bold file:font-uppercase file:text-xs file:px-4 file:py-1 file:active:bg-blue-600 file:border-none file:mr-4 file:rounded"
                  />
                  {validationMessage.file && (
                    <p className="text-sm text-red-500">
                      {validationMessage.file}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button className="mt-3 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-1">Tambah</span>
            </button>
          </form>
        </Disclosure.Panel>
      </Disclosure>

      <div className="mt-4 mb-4">
        {message && (
          <Alert type={message.includes("Error") ? "error" : "success"}>
            {message}
          </Alert>
        )}
      </div>

      {schedule.length > 0 ? (
        <DataTable
          columns={columns}
          data={schedule}
          pagination={true}
          customStyles={tableStyle}
        />
      ) : (
        "Belum ada data jadwal manasik haji"
      )}
    </DashboardLayout>
  );
};

export default DashboardConfiguration;
