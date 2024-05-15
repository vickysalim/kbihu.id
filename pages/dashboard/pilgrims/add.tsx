import { dateToPass, formatDateInput } from "@/lib/date/format";
import Alert from "@/views/components/Alert";
import Loader from "@/views/components/Loader";
import DashboardLayout from "@/views/layouts/DashboardLayout";
import {
  faEye,
  faEyeSlash,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

const validation = z.object({
  departure_year: z.coerce
    .number()
    .min(2000, { message: `Tahun keberangkatan wajib dimasukkan` })
    .max(3000, { message: `Tahun keberangkatan wajib dimasukkan` }),
  reg_number: z.string().optional(),
  portion_number: z
    .string()
    .min(1, { message: `Nomor porsi wajib dimasukkan` }),
  bank: z.string().min(1, { message: `Nama bank wajib dimasukkan` }),
  bank_branch: z.string().optional(),
  name: z.string().min(1, { message: `Nama wajib dimasukkan` }),
  nasab_name: z.string().min(1, { message: `Bin/Binti wajib dimasukkan` }),
  gender: z.string().min(1, { message: `Jenis kelamin wajib dimasukkan` }),
  marital_status: z.string().optional(),
  blood_type: z.string().optional(),
  pob: z.string().min(1, { message: `Tempat lahir wajib dimasukkan` }),
  dob: z.string().min(1, { message: `Tanggal lahir wajib dimasukkan` }),
  street: z.string().min(1, { message: `Alamat wajib dimasukkan` }),
  postal_code: z.coerce
    .number()
    .min(1, { message: `Kode pos wajib dimasukkan` }),
  subdistrict: z.string().min(1, { message: `Kelurahan wajib dimasukkan` }),
  district: z.string().min(1, { message: `Kecamatan wajib dimasukkan` }),
  city: z.string().min(1, { message: `Kota wajib dimasukkan` }),
  province: z.string().min(1, { message: `Provinsi wajib dimasukkan` }),
  education: z.string().optional(),
  job: z.string().optional(),
  passport_number: z
    .string()
    .min(1, { message: `Nomor paspor wajib dimasukkan` }),
  passport_name: z.string().min(1, { message: `Nama paspor wajib dimasukkan` }),
  passport_pob: z
    .string()
    .min(1, { message: `Tempat lahir paspor wajib dimasukkan` }),
  passport_dob: z
    .string()
    .min(1, { message: `Tanggal lahir paspor wajib dimasukkan` }),
  passport_issue_date: z
    .string()
    .min(1, { message: `Tanggal terbit paspor wajib dimasukkan` }),
  passport_expiry_date: z
    .string()
    .min(1, { message: `Tanggal berakhir paspor wajib dimasukkan` }),
  passport_issue_office: z
    .string()
    .min(1, { message: `Kantor terbit paspor wajib dimasukkan` }),
  passport_endorsement: z.string().optional(),
  identity_number: z.string().min(1, { message: `Nomor KTP wajib dimasukkan` }),
  phone_number: z
    .string()
    .min(1, { message: `Nomor telepon wajib dimasukkan` }),
  username: z.string().min(1, { message: `Username wajib dimasukkan` }),
  password: z.string().min(1, { message: `Password wajib dimasukkan` }),
  company_id: z.string().min(1, { message: `KBIHU tidak valid` }),
});

const DashboardPilgrimsAdd: React.FC = () => {
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

  const pilgrimsModel = {
    username: "",
    phone_number: "",
    password: "",
    company_id: "",
    user_profile: {
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

  const [hidePassword, setHidePassword] = useState(false);

  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});
  const [message, setMessage] = useState("");

  const validateInsert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationMessage({});

    try {
      validation.parse({
        departure_year: pilgrim.user_profile.departure_year,
        reg_number: pilgrim.user_profile.reg_number,
        portion_number: pilgrim.user_profile.portion_number,
        bank: pilgrim.user_profile.bank,
        bank_branch: pilgrim.user_profile.bank_branch,
        name: pilgrim.user_profile.name,
        nasab_name: pilgrim.user_profile.nasab_name,
        gender: pilgrim.user_profile.gender,
        marital_status: pilgrim.user_profile.marital_status,
        blood_type: pilgrim.user_profile.blood_type,
        pob: pilgrim.user_profile.pob,
        dob: pilgrim.user_profile.dob,
        street: pilgrim.user_profile.street,
        postal_code: pilgrim.user_profile.postal_code,
        subdistrict: pilgrim.user_profile.subdistrict,
        district: pilgrim.user_profile.district,
        city: pilgrim.user_profile.city,
        province: pilgrim.user_profile.province,
        education: pilgrim.user_profile.education,
        job: pilgrim.user_profile.job,
        passport_number: pilgrim.user_profile.passport_number,
        passport_name: pilgrim.user_profile.passport_name,
        passport_pob: pilgrim.user_profile.passport_pob,
        passport_dob: pilgrim.user_profile.passport_dob,
        passport_issue_date: pilgrim.user_profile.passport_issue_date,
        passport_expiry_date: pilgrim.user_profile.passport_expiry_date,
        passport_issue_office: pilgrim.user_profile.passport_issue_office,
        passport_endorsement: pilgrim.user_profile.passport_endorsement,
        identity_number: pilgrim.user_profile.identity_number,
        phone_number: pilgrim.phone_number,
        username: pilgrim.username,
        password: pilgrim.password,
        company_id: user.company_id,
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
    try {
      await axios
        .post(`/api/pilgrims/data/add`, {
          departure_year: pilgrim.user_profile.departure_year,
          reg_number: pilgrim.user_profile.reg_number,
          portion_number: pilgrim.user_profile.portion_number,
          bank: pilgrim.user_profile.bank,
          bank_branch: pilgrim.user_profile.bank_branch,
          name: pilgrim.user_profile.name,
          nasab_name: pilgrim.user_profile.nasab_name,
          gender: pilgrim.user_profile.gender,
          marital_status: pilgrim.user_profile.marital_status,
          blood_type: pilgrim.user_profile.blood_type,
          pob: pilgrim.user_profile.pob,
          dob: pilgrim.user_profile.dob,
          street: pilgrim.user_profile.street,
          postal_code: pilgrim.user_profile.postal_code,
          subdistrict: pilgrim.user_profile.subdistrict,
          district: pilgrim.user_profile.district,
          city: pilgrim.user_profile.city,
          province: pilgrim.user_profile.province,
          education: pilgrim.user_profile.education,
          job: pilgrim.user_profile.job,
          passport_number: pilgrim.user_profile.passport_number,
          passport_name: pilgrim.user_profile.passport_name,
          passport_pob: pilgrim.user_profile.passport_pob,
          passport_dob: pilgrim.user_profile.passport_dob,
          passport_issue_date: pilgrim.user_profile.passport_issue_date,
          passport_expiry_date: pilgrim.user_profile.passport_expiry_date,
          passport_issue_office: pilgrim.user_profile.passport_issue_office,
          passport_endorsement: pilgrim.user_profile.passport_endorsement,
          identity_number: pilgrim.user_profile.identity_number,
          phone_number: pilgrim.phone_number,
          username: pilgrim.username,
          password: pilgrim.password,
          company_id: user.company_id,
        })
        .then((res) => {
          setMessage(res.data.message);
          setPilgrim(pilgrimsModel);
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
  }, [isAuth, user]);

  if (!isAuth) return <Loader />;
  return (
    <DashboardLayout pageName="Tambah Jemaah Haji" role="Admin">
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={validateInsert}
      >
        <div className="grid grid-cols-1 gap-4 h-min-content">
          {/* Data BPIH */}
          <div className="flex flex-col bg-white rounded-lg">
            <div className="bg-blue-500 text-white rounded-t-lg px-4 py-2">
              Data BPIH
            </div>
            <div className="px-4 pt-3 pb-2">
              <div className="mb-2">
                <label
                  htmlFor="reg_number"
                  className="text-sm font-semibold text-gray-500"
                >
                  Nomor SPPH
                </label>
                <input
                  type="text"
                  id="reg_number"
                  value={pilgrim.user_profile.reg_number}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        reg_number: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.reg_number && (
                  <p className="text-sm text-red-500">
                    {validationMessage.reg_number}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="portion_number"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Nomor Porsi
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="portion_number"
                  value={pilgrim.user_profile.portion_number}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      username: e.target.value,
                      user_profile: {
                        ...pilgrim.user_profile,
                        portion_number: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.portion_number && (
                  <p className="text-sm text-red-500">
                    {validationMessage.portion_number}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="bank"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Bank
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bank"
                  value={pilgrim.user_profile.bank}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        bank: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.bank && (
                  <p className="text-sm text-red-500">
                    {validationMessage.bank}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="bank_branch"
                  className="text-sm font-semibold text-gray-500"
                >
                  Kantor Cabang Bank
                </label>
                <input
                  type="text"
                  id="bank_branch"
                  value={pilgrim.user_profile.bank_branch}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        bank_branch: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.bank_branch && (
                  <p className="text-sm text-red-500">
                    {validationMessage.bank_branch}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Data Paspor */}
          <div className="flex flex-col bg-white rounded-lg">
            <div className="bg-blue-500 text-white rounded-t-lg px-4 py-2">
              Data Paspor
            </div>
            <div className="px-4 pt-3 pb-2">
              <div className="mb-2">
                <label
                  htmlFor="passport_number"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Nomor Paspor
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="passport_number"
                  value={pilgrim.user_profile.passport_number}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_number: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_number && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_number}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="passport_name"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Nama Paspor
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="passport_name"
                  value={pilgrim.user_profile.passport_name}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_name: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_name && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_name}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="passport_pob"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Tempat Lahir Paspor
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="passport_pob"
                  value={pilgrim.user_profile.passport_pob}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_pob: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_pob && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_pob}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="passport_dob"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Tanggal Lahir Paspor
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="passport_dob"
                  value={formatDateInput(pilgrim.user_profile.passport_dob)}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_dob: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_dob && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_dob}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="passport_issue_date"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Tanggal Penerbitan Paspor
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="passport_issue_date"
                  value={formatDateInput(
                    pilgrim.user_profile.passport_issue_date
                  )}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_issue_date: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_issue_date && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_issue_date}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="passport_expiry_date"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Tanggal Berakhir Paspor
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="passport_expiry_date"
                  value={formatDateInput(
                    pilgrim.user_profile.passport_expiry_date
                  )}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_expiry_date: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_expiry_date && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_expiry_date}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="passport_issue_office"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Kantor Penerbit Paspor
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="passport_issue_office"
                  value={pilgrim.user_profile.passport_issue_office}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_issue_office: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_issue_office && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_issue_office}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="passport_endorsement"
                  className="text-sm font-semibold text-gray-500"
                >
                  Nama Endorsement
                </label>
                <input
                  type="text"
                  id="passport_endorsement"
                  value={pilgrim.user_profile.passport_endorsement}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        passport_endorsement: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.passport_endorsement && (
                  <p className="text-sm text-red-500">
                    {validationMessage.passport_endorsement}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Data Lainnya */}
          <div className="flex flex-col bg-white rounded-lg">
            <div className="bg-blue-500 text-white rounded-t-lg px-4 py-2">
              Data Lainnya
            </div>
            <div className="px-4 pt-3 pb-2">
              <div className="mb-2">
                <label
                  htmlFor="identity_number"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Nomor KTP
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="identity_number"
                  value={pilgrim.user_profile.identity_number}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        identity_number: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.identity_number && (
                  <p className="text-sm text-red-500">
                    {validationMessage.identity_number}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="departure_year"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Tahun Keberangkatan
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="departure_year"
                  value={pilgrim.user_profile.departure_year}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        departure_year: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.departure_year && (
                  <p className="text-sm text-red-500">
                    {validationMessage.departure_year}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="phone_number"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Nomor Telepon
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="phone_number"
                  value={pilgrim.phone_number}
                  onChange={(e) =>
                    setPilgrim({ ...pilgrim, phone_number: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.phone_number && (
                  <p className="text-sm text-red-500">
                    {validationMessage.phone_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 h-min-content">
          {/* Identitas Jemaah Haji */}
          <div className="flex flex-col bg-white rounded-lg">
            <div className="bg-blue-500 text-white rounded-t-lg px-4 py-2">
              Identitas Jemaah Haji
            </div>
            <div className="px-4 pt-3 pb-2">
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Nama
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={pilgrim.user_profile.name}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.name && (
                  <p className="text-sm text-red-500">
                    {validationMessage.name}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="nasab_name"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  {pilgrim.user_profile.gender == "Laki-laki"
                    ? "Bin"
                    : pilgrim.user_profile.gender == "Perempuan"
                    ? "Binti"
                    : "Bin/Binti"}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nasab_name"
                  value={pilgrim.user_profile.nasab_name}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        nasab_name: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.nasab_name && (
                  <p className="text-sm text-red-500">
                    {validationMessage.nasab_name}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="gender"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Jenis Kelamin
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-row gap-6">
                  <label htmlFor="male" className="flex items-center gap-x-1">
                    <input
                      className="h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent"
                      type="radio"
                      id="male"
                      value="Laki-laki"
                      checked={pilgrim.user_profile.gender === "Laki-laki"}
                      onChange={(e) =>
                        setPilgrim({
                          ...pilgrim,
                          user_profile: {
                            ...pilgrim.user_profile,
                            gender: e.target.value,
                          },
                        })
                      }
                    />
                    <span>Laki-laki</span>
                  </label>
                  <label htmlFor="female" className="flex items-center gap-x-1">
                    <input
                      className="h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent"
                      type="radio"
                      id="female"
                      value="Perempuan"
                      checked={pilgrim.user_profile.gender === "Perempuan"}
                      onChange={(e) =>
                        setPilgrim({
                          ...pilgrim,
                          user_profile: {
                            ...pilgrim.user_profile,
                            gender: e.target.value,
                          },
                        })
                      }
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
                {validationMessage.gender && (
                  <p className="text-sm text-red-500">
                    {validationMessage.gender}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="marital_status"
                  className="text-sm font-semibold text-gray-500"
                >
                  Status Perkawinan
                </label>
                <input
                  type="text"
                  id="marital_status"
                  value={pilgrim.user_profile.marital_status}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        marital_status: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.marital_status && (
                  <p className="text-sm text-red-500">
                    {validationMessage.marital_status}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="blood_type"
                  className="text-sm font-semibold text-gray-500"
                >
                  Golongan Darah
                </label>
                <input
                  type="text"
                  id="blood_type"
                  value={pilgrim.user_profile.blood_type}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        blood_type: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.blood_type && (
                  <p className="text-sm text-red-500">
                    {validationMessage.blood_type}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="pob"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Tempat Lahir
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pob"
                  value={pilgrim.user_profile.pob}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        pob: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.pob && (
                  <p className="text-sm text-red-500">
                    {validationMessage.pob}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="dob"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Tanggal Lahir
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  value={formatDateInput(pilgrim.user_profile.dob)}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      password: dateToPass(e.target.value),
                      user_profile: {
                        ...pilgrim.user_profile,
                        dob: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.dob && (
                  <p className="text-sm text-red-500">
                    {validationMessage.dob}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="province"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Provinsi
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="province"
                  value={pilgrim.user_profile.province}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        province: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.province && (
                  <p className="text-sm text-red-500">
                    {validationMessage.province}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="city"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Kabupaten/Kota
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  value={pilgrim.user_profile.city}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        city: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.city && (
                  <p className="text-sm text-red-500">
                    {validationMessage.city}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="district"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Kecamatan
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="district"
                  value={pilgrim.user_profile.district}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        district: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.district && (
                  <p className="text-sm text-red-500">
                    {validationMessage.district}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="subdistrict"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Desa/Kelurahan
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subdistrict"
                  value={pilgrim.user_profile.subdistrict}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        subdistrict: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.subdistrict && (
                  <p className="text-sm text-red-500">
                    {validationMessage.subdistrict}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="street"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Alamat
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="street"
                  value={pilgrim.user_profile.street}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        street: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.street && (
                  <p className="text-sm text-red-500">
                    {validationMessage.street}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="postal_code"
                  className="text-sm font-semibold text-gray-500"
                  title="Wajib dimasukkan"
                >
                  Kode Pos
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postal_code"
                  value={pilgrim.user_profile.postal_code}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        postal_code: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.postal_code && (
                  <p className="text-sm text-red-500">
                    {validationMessage.postal_code}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="education"
                  className="text-sm font-semibold text-gray-500"
                >
                  Pendidikan
                </label>
                <input
                  type="text"
                  id="education"
                  value={pilgrim.user_profile.education}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        education: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.education && (
                  <p className="text-sm text-red-500">
                    {validationMessage.education}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="job"
                  className="text-sm font-semibold text-gray-500"
                >
                  Pekerjaan
                </label>
                <input
                  type="text"
                  id="job"
                  value={pilgrim.user_profile.job}
                  onChange={(e) =>
                    setPilgrim({
                      ...pilgrim,
                      user_profile: {
                        ...pilgrim.user_profile,
                        job: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                />
                {validationMessage.job && (
                  <p className="text-sm text-red-500">
                    {validationMessage.job}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Data Login */}
          <div className="flex flex-col bg-white rounded-lg">
            <div className="bg-blue-500 text-white rounded-t-lg px-4 py-2">
              Data Login Pengguna
            </div>
            <div className="px-4 pt-3 pb-2">
              <div className="mb-2">
                <label
                  htmlFor="username"
                  className="text-sm font-semibold text-gray-500"
                >
                  ID Pengguna
                </label>
                <input
                  type="text"
                  id="username"
                  value={pilgrim.user_profile.portion_number}
                  disabled={true}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
                {validationMessage.username && (
                  <p className="text-sm text-red-500">
                    {validationMessage.username}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-500"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={hidePassword ? "password" : "text"}
                    id="password"
                    value={dateToPass(pilgrim.user_profile.dob)}
                    disabled={true}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    className="absolute top-2 bottom-2 right-3 text-blue-500 font-bold uppercase text-xs outline-none focus:outline-none px-3"
                    onClick={() => setHidePassword(!hidePassword)}
                  >
                    {hidePassword ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </button>
                </div>
                {validationMessage.password && (
                  <p className="text-sm text-red-500">
                    {validationMessage.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Button Submit */}
          <div className="flex flex-row-reverse gap-4">
            <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
              <FontAwesomeIcon icon={faFloppyDisk} />
              <span className="ml-2">Simpan</span>
            </button>
            <button
              type="button"
              className="text-blue-500 active:text-blue-600 font-bold uppercase text-xs outline-none focus:outline-none"
              onClick={() => (window.location.href = "/dashboard/pilgrims")}
            >
              Kembali
            </button>
          </div>
        </div>
      </form>
      <div className="mt-4">
        {message && (
          <Alert type={message.includes("Error") ? "error" : "success"}>
            {message}
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPilgrimsAdd;
