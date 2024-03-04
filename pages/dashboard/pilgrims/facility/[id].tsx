import { dataTableStyle } from "@/lib/dataTable/style";
import { formatDate, formatDateInput } from "@/lib/date/format";
import { downloadFile } from "@/lib/download";
import Alert from "@/views/components/Alert";
import Loader from "@/views/components/Loader";
import AdminPilgrimsTabLayout from "@/views/layouts/AdminLayout/pilgrims/tab";
import DashboardLayout from "@/views/layouts/DashboardLayout";
import {
  faDownload,
  faPen,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Disclosure } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { z } from "zod";

const validation = z.object({
  date: z.string().min(1, { message: "Tanggal pengumpulan harus diisi" }),
});

const DashboardPilgrimsFacilityDetail: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [userAccountId, setUserAccountId] = useState("");

  const facilityModel = {
    id: "",
    company_id: "",
    name: "",
    company_facility_year: [
      {
        id: "",
        year: "",
      },
    ],
    user_facility: [
      {
        id: "",
        file: "",
        description: "",
        submit_date: "",
      },
    ],
  };

  const [facility, setFacility] = useState([facilityModel]);

  const [countDone, setCountDone] = useState(0);
  const [donePercentage, setDonePercentage] = useState(0);

  const facilityData = useCallback(async () => {
    console.log(router.query.id, " ", userAccountId);
    if (router.query.id != undefined) {
      await axios
        .get(`/api/pilgrims/facility/get/${router.query.id}`)
        .then((res) => {
          setFacility(res.data.data);
          setCountDone(
            res.data.data.filter((item: any) => item.user_facility.length > 0)
              .length
          );
          setDonePercentage((countDone / res.data.data.length) * 100);
        })
        .catch((error) => {
          setMessage(`Error: ${error.response.data.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [countDone, router.query.id]);

  const columns = useMemo(
    () => [
      {
        name: "Aksi",
        cell: (row: any) => {
          if (row.user_facility.length > 0)
            return (
              <button
                type="button"
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
                onClick={() => handleDelete(row.user_facility[0].id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span className="ml-1">Hapus</span>
              </button>
            );
          else
            return (
              <button
                type="button"
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
                onClick={() => handleOpenEditModal(row.id, row.name)}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span className="ml-1">Lengkapi</span>
              </button>
            );
        },
        width: "150px",
      },
      {
        name: "",
        cell: (row: any) => {
          return (
            <input
              type="checkbox"
              className="h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent rounded cursor-not-allowed"
              disabled={true}
              checked={row.user_facility.length > 0}
            />
          );
        },
        width: "25px",
      },
      {
        name: "Nama Fasilitas",
        cell: (row: any) => {
          return <div className="mb-0.5 flex items-center">{row.name}</div>;
        },
      },
      {
        name: "Detail Pengumpulan",
        cell: (row: any) => {
          return row.user_facility.length > 0 ? (
            <div className="flex flex-col">
              <p>
                Tanggal Pengumpulan:{" "}
                {formatDateInput(row.user_facility[0].submit_date)}
              </p>
              <p>Keterangan: {row.user_facility[0].description || "-"}</p>
            </div>
          ) : (
            ""
          );
        },
      },
    ],
    [router.query.id]
  );

  const handleDelete = async (facilityId: String) => {
    if (
      confirm(
        "Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan"
      )
    ) {
      try {
        await axios
          .delete("/api/pilgrims/facility/delete", {
            data: {
              id: facilityId,
            },
          })
          .then((res) => {
            setRefreshKey((prevKey) => prevKey + 1);
            facilityData();
            setMessage(res.data.message);
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

  const [message, setMessage] = useState("");

  // complete data

  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const userFacilityModel = {
    company_facility_id: "",
    name: "",
    description: "",
    submit_date: "",
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFacility, setEditFacility] = useState(userFacilityModel);

  const handleOpenEditModal = (company_facility_id: any, name: any) => {
    setEditModalOpen(true);
    setEditFacility({
      ...editFacility,
      name: name,
      company_facility_id: company_facility_id,
    });
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditFacility(userFacilityModel);
  };

  const validateEdit = async (e: any) => {
    e.preventDefault();
    setValidationMessage({});

    try {
      validation.parse({
        date: editFacility.submit_date,
      });

      handleEdit();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setValidationMessage(errorMap);
      } else {
        setMessage(`Unknown error`);
      }
    }
  };

  const handleEdit = async () => {
    try {
      await axios
        .post(`/api/pilgrims/facility/add`, {
          facility_id: editFacility.company_facility_id,
          user_id: userAccountId,
          submit_date: editFacility.submit_date,
          description: editFacility.description || null,
        })
        .then((res) => {
          setMessage(res.data.message);
          facilityData();
          handleCloseEditModal();
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

    if (router.isReady && router.query.id) {
      setUserAccountId(router.query.id as string);
    }

    facilityData();
  }, [isAuth, user, facilityData, router.isReady, router.query.id]);

  const tableStyle: {} = dataTableStyle;

  if (loading || !isAuth) return <Loader />;
  return (
    <DashboardLayout pageName="Data Fasilitas Jemaah Haji" role="Admin">
      <AdminPilgrimsTabLayout id={router.query.id} activeTab="facility" />
      <div className="mt-4 mb-4">
        {message && (
          <Alert type={message.includes("Error") ? "error" : "success"}>
            {message}
          </Alert>
        )}
      </div>

      <div className="mb-4">
        <div className="bg-white rounded-md overflow-hidden">
          <div className="relative h-2 flex items-center justify-center">
            <div
              className="absolute top-0 bottom-0 left-0 rounded-md bg-blue-500"
              style={{ width: `${donePercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex py-1">
          <div className="basis-1/2 text-left font-medium text-sm">
            {countDone} / {facility.length} fasilitas dikumpulkan
          </div>
          <div className="basis-1/2 text-right font-medium text-sm">
            {donePercentage}%
          </div>
        </div>
      </div>

      {facility.length > 0 && facility ? (
        <DataTable
          columns={columns}
          data={facility}
          pagination={true}
          customStyles={tableStyle}
        />
      ) : (
        "Terjadi kesalahan. Silakan refresh halaman."
      )}

      {/* modal edit */}
      <Dialog
        open={editModalOpen}
        onClose={() => handleCloseEditModal()}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg p-6 rounded-lg bg-white">
            <Dialog.Title className="flex flex-row justify-between pb-4 border-b-2">
              <h2 className="text-xl font-semibold mb-2">Lengkapi Fasilitas</h2>
              <button onClick={() => handleCloseEditModal()}>
                <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
              </button>
            </Dialog.Title>
            <Dialog.Description className="mt-4 flex flex-col">
              <form onSubmit={validateEdit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Nama Fasilitas
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={editFacility.name}
                      disabled={true}
                      className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="date"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Tanggal Pengumpulan
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formatDateInput(editFacility.submit_date)}
                      onChange={(e) =>
                        setEditFacility({
                          ...editFacility,
                          submit_date: e.target.value,
                        })
                      }
                      className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                    {validationMessage.date && (
                      <p className="text-sm text-red-500">
                        {validationMessage.date}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Keterangan
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={editFacility.description}
                      onChange={(e) =>
                        setEditFacility({
                          ...editFacility,
                          description: e.target.value,
                        })
                      }
                      className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                  <FontAwesomeIcon icon={faPen} />
                  <span className="ml-1">Lengkapi Fasilitas</span>
                </button>
              </form>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardPilgrimsFacilityDetail;
