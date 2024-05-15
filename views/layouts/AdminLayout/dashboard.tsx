import { dataTableStyle } from "@/lib/dataTable/style";
import Alert from "@/views/components/Alert";
import Card from "@/views/components/Card";
import Done from "@/views/components/Done";
import { faBuilding } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faPencil,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Disclosure } from "@headlessui/react";
import axios from "axios";
import { title } from "process";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import AdminEditInformationLayout from "./information/edit";

interface AdminIndexProps {
  companyId: string;
}

const AdminIndexLayout = ({ companyId }: AdminIndexProps) => {
  const [data, setData] = useState({
    user: 0,
    payment: 0,
    document: 0,
    facility: 0,
  });

  const [onboarding, setOnboarding] = useState({
    profile: true,
    pilgrim: true,
    document: true,
    facility: true,
    schedule: true,
  });

  const informationModel = {
    id: "",
    title: "",
    description: "",
  };

  const [information, setInformation] = useState([informationModel]);
  const [addInformation, setAddInformation] = useState(informationModel);

  const [message, setMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const getInformation = useCallback(async () => {
    try {
      await axios.get(`/api/information/get/${companyId}`).then((res) => {
        setInformation(res.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [companyId]);

  const validateInsert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors = {};
    if (!addInformation.title) {
      errors = { ...errors, title: "Judul harus diisi" };
    }
    if (!addInformation.description) {
      errors = { ...errors, description: "Deskripsi harus diisi" };
    }
    if (Object.keys(errors).length > 0) {
      setValidationMessage(errors);
    } else {
      setValidationMessage({});
      insertInformation();
    }
  };

  // insert

  const insertInformation = async () => {
    try {
      await axios
        .post("/api/information/add", {
          company_id: companyId,
          title: addInformation.title,
          description: addInformation.description,
        })
        .then((res) => {
          setMessage(res.data.message);
          setAddInformation(informationModel);
          getInformation();
        });
    } catch (error: any) {
      console.log(error.response.data.message);
      if (error.response) {
        const fieldError = error.response.data.message;
        setMessage(`Error: ${fieldError}`);
      } else {
        setMessage(`Unknown Error`);
      }
    }
  };

  // edit

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editInformation, setEditInformation] = useState(informationModel);

  const handleEditInformation = (item: any) => {
    setEditModalOpen(true);
    setEditInformation(item);
  };

  const setEditMessage = (message: any) => {
    setMessage(message);
    closeEditInformation();
  };

  const closeEditInformation = () => {
    setEditModalOpen(false);
    setEditInformation(informationModel);
  };

  // delete

  const deleteInformation = async (id: string) => {
    if (
      confirm(
        "Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan"
      )
    ) {
      try {
        await axios
          .delete("/api/information/delete", {
            data: {
              id: id,
            },
          })
          .then((res) => {
            setMessage(res.data.message);
            getInformation();
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

  const informationColumns = useMemo(
    () => [
      {
        name: "Aksi",
        cell: (row: any) => {
          return (
            <>
              <button
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
                onClick={() => handleEditInformation(row)}
              >
                <FontAwesomeIcon icon={faPencil} />
                <span className="ml-1">Edit</span>
              </button>
              <button
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
                onClick={() => deleteInformation(row.id)}
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
        name: "Judul",
        cell: (row: any) => {
          return row.title;
        },
      },
      {
        name: "Deskripsi",
        cell: (row: any) => {
          return (
            <div style={{ whiteSpace: "pre-wrap" }} className="line-clamp-2">
              {row.description}
            </div>
          );
        },
      },
    ],
    []
  );

  const tableStyle: {} = dataTableStyle;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/count/getCompanyData/${companyId}`
        );

        const onboarding = await axios.get(
          `/api/count/getOnboarding/${companyId}`
        );

        setData(response.data.data);
        setOnboarding(onboarding.data.data);
      } catch (error) {
        console.log(error);
      }

      getInformation();
    };

    fetchData();
  }, [companyId, getInformation]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
            <FontAwesomeIcon
              icon={faBuilding}
              className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <h2 className="text-2xl font-bold">{data.user}</h2>
          <h2 className="text-sm text-slate-500">Jemaah Haji</h2>
        </Card>
        <Card>
          <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
            <FontAwesomeIcon
              icon={faBuilding}
              className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <h2 className="text-2xl font-bold">{data.payment}</h2>
          <h2 className="text-sm text-slate-500">Data Pembayaran</h2>
        </Card>
        <Card>
          <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
            <FontAwesomeIcon
              icon={faBuilding}
              className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <h2 className="text-2xl font-bold">{data.document}</h2>
          <h2 className="text-sm text-slate-500">Data Dokumen</h2>
        </Card>
        <Card>
          <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
            <FontAwesomeIcon
              icon={faBuilding}
              className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <h2 className="text-2xl font-bold">{data.facility}</h2>
          <h2 className="text-sm text-slate-500">Data Fasilitas Diserahkan</h2>
        </Card>
      </div>
      {onboarding.profile === true &&
      onboarding.pilgrim === true &&
      onboarding.document === true &&
      onboarding.facility === true &&
      onboarding.schedule === true ? (
        ""
      ) : (
        <div className="bg-white p-4 mt-4 mb-2 rounded-lg">
          <div className="mb-2 border-b pb-2">
            <h1 className="text-lg font-bold">Selamat datang di KBIHU.id</h1>
            <div className="text-slate-500">
              Selesaikan beberapa tugas berikut untuk memulai
            </div>
          </div>
          <div className="mt-4">
            <div
              className={`py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center ${
                onboarding.profile === false ? "hover:cursor-pointer" : ""
              }`}
              onClick={() =>
                onboarding.profile === false
                  ? (window.location.href = "/dashboard/company-profile")
                  : ""
              }
            >
              <div className="flex flex-row">
                <Done type={onboarding.profile} />
                <div>Lengkapi profil KBIHU</div>
              </div>
              <div className="w-fit text-blue-500">Selesaikan</div>
            </div>
            <div
              className={`py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center ${
                onboarding.pilgrim === false ? "hover:cursor-pointer" : ""
              }`}
              onClick={() =>
                onboarding.pilgrim === false
                  ? (window.location.href = "/dashboard/pilgrims")
                  : ""
              }
            >
              <div className="flex flex-row">
                <Done type={onboarding.pilgrim} />
                <div>Tambah data jemaah haji pertama</div>
              </div>
              <div className="w-fit text-blue-500">Selesaikan</div>
            </div>
            <div
              className={`py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center ${
                onboarding.document === false ? "hover:cursor-pointer" : ""
              }`}
              onClick={() =>
                onboarding.document === false
                  ? (window.location.href = "/dashboard/config")
                  : ""
              }
            >
              <div className="flex flex-row">
                <Done type={onboarding.document} />
                <div>Lengkapi data dokumen</div>
              </div>
              <div className="w-fit text-blue-500">Selesaikan</div>
            </div>
            <div
              className={`py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center ${
                onboarding.facility === false ? "hover:cursor-pointer" : ""
              }`}
              onClick={() =>
                onboarding.facility === false
                  ? (window.location.href = "/dashboard/config")
                  : ""
              }
            >
              <div className="flex flex-row">
                <Done type={onboarding.facility} />
                <div>Lengkapi data fasilitas</div>
              </div>
              <div className="w-fit text-blue-500">Selesaikan</div>
            </div>
            <div
              className={`py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center ${
                onboarding.schedule === false ? "hover:cursor-pointer" : ""
              }`}
              onClick={() =>
                onboarding.schedule === false
                  ? (window.location.href = "/dashboard/schedule")
                  : ""
              }
            >
              <div className="flex flex-row">
                <Done type={onboarding.schedule} />
                <div>Lengkapi jadwal manasik haji</div>
              </div>
              <div className="w-fit text-blue-500">Selesaikan</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-lg font-bold mt-4 mb-2">Informasi</h1>
        <div className="mt-4">
          {message && (
            <Alert type={message.includes("Error") ? "error" : "success"}>
              {message}
            </Alert>
          )}
        </div>
        <div className="mb-4">
          <Disclosure>
            <Disclosure.Button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-1">Tambah Informasi</span>
            </Disclosure.Button>
            <Disclosure.Panel className="mt-2 text-gray-500 bg-white rounded-lg p-4">
              <form onSubmit={validateInsert}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="title"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Judul
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={addInformation.title}
                      onChange={(e) =>
                        setAddInformation({
                          ...addInformation,
                          title: e.target.value,
                        })
                      }
                      className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {validationMessage.title && (
                      <p className="text-sm text-red-500">
                        {validationMessage.title}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      value={addInformation.description}
                      onChange={(e) =>
                        setAddInformation({
                          ...addInformation,
                          description: e.target.value,
                        })
                      }
                      className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none resize-none"
                    />
                    {validationMessage.description && (
                      <p className="text-sm text-red-500">
                        {validationMessage.description}
                      </p>
                    )}
                  </div>
                </div>
                <button className="mt-3 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="ml-1">Tambah</span>
                </button>
              </form>
            </Disclosure.Panel>
          </Disclosure>
        </div>
        {information.length > 0 ? (
          <DataTable
            columns={informationColumns}
            data={information}
            pagination={true}
            customStyles={tableStyle}
          />
        ) : (
          "Tidak ada data informasi"
        )}
      </div>

      {/* modal edit */}
      <Dialog
        open={editModalOpen}
        onClose={() => closeEditInformation()}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg p-6 rounded-lg bg-white">
            <Dialog.Title className="flex flex-row justify-between pb-4 border-b-2">
              <h2 className="text-xl font-semibold mb-2">Edit Informasi</h2>
              <button onClick={() => closeEditInformation()}>
                <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
              </button>
            </Dialog.Title>
            <Dialog.Description className="mt-4 flex flex-col">
              <AdminEditInformationLayout
                loadData={getInformation}
                data={editInformation}
                setMessage={setEditMessage}
              />
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default AdminIndexLayout;
