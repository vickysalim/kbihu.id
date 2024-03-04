import { dataTableStyle } from "@/lib/dataTable/style";
import { formatDate } from "@/lib/date/format";
import { downloadFile } from "@/lib/download";
import Alert from "@/views/components/Alert";
import Loader from "@/views/components/Loader";
import InvoicePdf from "@/views/document/payment";
import AdminPilgrimsTabLayout from "@/views/layouts/AdminLayout/pilgrims/tab";
import DashboardLayout from "@/views/layouts/DashboardLayout";
import {
  faDownload,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { set, z } from "zod";
import { padNumbers } from "@/lib/number/format";

const validation = z.object({
  year: z.string().min(1, { message: "Keterangan harus diisi" }),
});

const DashboardPilgrimsPaymentDetail: React.FC = () => {
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

  const paymentModel = {
    id: "",
    amount: "",
    note: "",
    proof_file: "",
    transaction_date: "",
  };

  const [payment, setPayment] = useState([paymentModel]);
  const [addPayment, setAddPayment] = useState(paymentModel);

  const paymentData = async () => {
    if (router.query.id != undefined) {
      try {
        await axios
          .get(`/api/pilgrims/payment/get/${router.query.id}`)
          .then((res) => {
            setPayment(res.data.data);
            pilgrimData();
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pilgrimsModel = {
    id: "",
    username: "",
    phone_number: "",
    company_id: "",
    user_profile: {
      id: "",
      departure_year: "",
      reg_number: "",
      portion_number: "",
      bank: "",
      bank_branch: "",
      name: "",
      nasab_name: "",
      gender: "",
      marital_status: "",
      blood_type: "",
      pob: "",
      dob: "",
      street: "",
      postal_code: "",
      subdistrict: "",
      district: "",
      city: "",
      province: "",
      education: "",
      job: "",
      passport_number: "",
      passport_name: "",
      passport_pob: "",
      passport_dob: "",
      passport_issue_date: "",
      passport_expiry_date: "",
      passport_issue_office: "",
      passport_endorsement: "",
      identity_number: "",
    },
  };

  const [pilgrim, setPilgrim] = useState(pilgrimsModel);

  const pilgrimData = async () => {
    if (router.query.id != undefined) {
      try {
        await axios
          .get(`/api/pilgrims/data/get/${router.query.id}`)
          .then((res) => {
            setPilgrim(res.data.data);
            companyData(res.data.data.company_id);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const companyModel = {
    id: "",
    name: "",
    street: "",
    district: "",
    subdistrict: "",
    city: "",
    province: "",
    postal_code: "",
    company_logo: "",
    phone_number: "",
    leader: "",
    license: "",
  };

  const [company, setCompany] = useState(companyModel);

  const companyData = async (id: string) => {
    if (id != undefined) {
      try {
        await axios.get(`/api/company/get/${id}`).then((res) => {
          setCompany(res.data.data);
          setLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const downloadProof = async (proof_file: string) => {
    if (proof_file)
      await downloadFile(
        `/upload_files/pilgrims/payment/${proof_file}`,
        proof_file
      );
  };

  const columns = useMemo(
    () => [
      {
        name: "Aksi",
        cell: (row: any) => {
          return (
            <button
              type="button"
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
              onClick={() => handleDelete(row.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              <span className="ml-1">Hapus</span>
            </button>
          );
        },
        width: "150px",
      },
      {
        name: "Jumlah Pembayaran",
        cell: (row: any) => {
          return (
            <>
              Rp.{" "}
              {row.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
            </>
          );
        },
      },
      {
        name: "Keterangan",
        cell: (row: any) => {
          return row.note;
        },
        width: "400px",
      },
      {
        name: "Tanggal Transaksi",
        cell: (row: any) => {
          return formatDate(row.transaction_date);
        },
      },
      {
        name: "Bukti Pembayaran",
        cell: (row: any) => {
          return (
            <button
              className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1 disabled:bg-gray-500 disabled:active:bg-gray-600"
              disabled={!row.proof_file}
              onClick={() => downloadProof(row.proof_file)}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span className="ml-1">
                {row.proof_file ? "Unduh Bukti" : "Tidak Tersedia"}
              </span>
            </button>
          );
        },
        width: "175px",
      },
      {
        name: "Kwitansi",
        cell: (row: any, index: any) => {
          if (pilgrim.user_profile.name)
            return (
              <PDFDownloadLink
                document={
                  <InvoicePdf
                    id={row.id}
                    amount={row.amount}
                    description={row.note}
                    transactionDate={row.transaction_date}
                    transactionNumber={padNumbers(index + 1)}
                    name={pilgrim.user_profile.name}
                    city={company.city}
                    address={`${company.street}, Kel. ${company.subdistrict}, Kec. ${company.district}, Kota ${company.city}, ${company.province}, ${company.postal_code}`}
                    companyName={company.name}
                  />
                }
                fileName={`invoice-${row.id}.pdf`}
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1 disabled:bg-gray-500 disabled:active:bg-gray-600"
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    "Loading document..."
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faDownload} />
                      <span className="ml-1">Unduh Kwitansi (A5)</span>
                    </>
                  )
                }
              </PDFDownloadLink>
            );
        },
        width: "225px",
      },
    ],
    [pilgrim.user_profile.name, company.name]
  );

  const [message, setMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const fileProofInputRef = useRef(null);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddPayment({ ...addPayment, proof_file: file });
    }
  };

  const validateInsert = async (e: any) => {
    e.preventDefault();
    setValidationMessage({});

    try {
      validation.parse({
        transaction_date: addPayment.transaction_date,
        amount: addPayment.amount,
        note: addPayment.note,
      });

      handleInsert();
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

  const handleInsert = async () => {
    let formData = new FormData();

    formData.append("id", router.query.id as string);
    formData.append("transaction_date", addPayment.transaction_date);
    formData.append("amount", addPayment.amount);
    formData.append("note", addPayment.note);

    if (addPayment.proof_file)
      formData.append("proof_file", addPayment.proof_file);

    try {
      await axios.post(`/api/pilgrims/payment/add`, formData).then((res) => {
        setMessage(res.data.message);
        paymentData();
        setAddPayment(paymentModel);
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

  const handleDelete = async (paymentId: String) => {
    if (
      confirm(
        "Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan"
      )
    ) {
      try {
        await axios
          .delete("/api/pilgrims/payment/delete", {
            data: {
              id: paymentId,
            },
          })
          .then((res) => {
            setMessage(res.data.message);
            paymentData();
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

  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.href = "/auth/login";
    else {
      if (!isAuth) checkToken();
    }

    paymentData();
  }, [isAuth, user]);

  const tableStyle: {} = dataTableStyle;

  if (loading || !isAuth) return <Loader />;
  return (
    <DashboardLayout pageName="Data Pembayaran Jemaah Haji" role="Admin">
      <AdminPilgrimsTabLayout id={router.query.id} activeTab="payment" />

      <div className="mb-2">
        <Disclosure>
          <Disclosure.Button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-1">Tambah Data Pembayaran</span>
          </Disclosure.Button>
          <Disclosure.Panel className="mt-2 text-gray-500 bg-white rounded-lg p-4">
            <form onSubmit={validateInsert}>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="transaction_date"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Tanggal Pembayaran
                    </label>
                    <input
                      type="date"
                      id="transaction_date"
                      value={addPayment.transaction_date}
                      onChange={(e) =>
                        setAddPayment({
                          ...addPayment,
                          transaction_date: e.target.value,
                        })
                      }
                      className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                    {validationMessage.transaction_date && (
                      <p className="text-sm text-red-500">
                        {validationMessage.transaction_date}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="amount"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Jumlah Pembayaran
                    </label>
                    <div className="relative">
                      <span className="absolute top-2 bottom-2 left-3">
                        Rp.
                      </span>
                      <input
                        type="number"
                        id="amount"
                        value={addPayment.amount}
                        onChange={(e) =>
                          setAddPayment({
                            ...addPayment,
                            amount: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 p-2 pl-10 focus:outline-none focus:border-blue-500"
                      />
                      {validationMessage.amount && (
                        <p className="text-sm text-red-500">
                          {validationMessage.amount}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Upload Bukti Pembayaran
                    </label>
                    <input
                      type="file"
                      id="logo"
                      ref={fileProofInputRef}
                      onChange={handleInputFile}
                      className="bg-white p-2 w-full text-slate-500 text-sm rounded-lg leading-6 border border-gray-300 focus:border-blue-500 file:bg-blue-500 file:text-white file:font-bold file:font-uppercase file:text-xs file:px-4 file:py-1 file:active:bg-blue-600 file:border-none file:mr-4 file:rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="note"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Keterangan
                    </label>
                    <input
                      type="text"
                      id="note"
                      value={addPayment.note}
                      onChange={(e) =>
                        setAddPayment({ ...addPayment, note: e.target.value })
                      }
                      className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                    {validationMessage.note && (
                      <p className="text-sm text-red-500">
                        {validationMessage.note}
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
      </div>

      <div className="mt-4 mb-4">
        {message && (
          <Alert type={message.includes("Error") ? "error" : "success"}>
            {message}
          </Alert>
        )}
      </div>

      {payment.length > 0 && pilgrim ? (
        <DataTable
          columns={columns}
          data={payment}
          pagination={true}
          customStyles={tableStyle}
        />
      ) : (
        "Belum ada data pembayaran"
      )}
    </DashboardLayout>
  );
};

export default DashboardPilgrimsPaymentDetail;
