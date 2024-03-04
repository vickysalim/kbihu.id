import Loader from "@/views/components/Loader";
import DashboardLayout from "@/views/layouts/DashboardLayout";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { dataTableStyle } from "@/lib/dataTable/style";
import { multipleDataInclude } from "@/lib/data/include";
import { formatDate } from "@/lib/date/format";
import Alert from "@/views/components/Alert";

const DashboardPilgrims: React.FC = () => {
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

  const [message, setMessage] = useState("");

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

  const [pilgrims, setPilgrims] = useState([pilgrimsModel]);

  const pilgrimsData = useCallback(async () => {
    try {
      await axios
        .get(`/api/pilgrims/data/getAll/${user.company_id}`)
        .then((res) => {
          setPilgrims(res.data.data);
          setLoading(false);
        });
    } catch (error) {
      setMessage("Gagal memuat data jemaah haji");
    }
  }, [user.company_id]);

  const [selectedPilgrims, setSelectedPilgrims] = useState<string[]>([]);
  const [yearPilgrims, setYearPilgrims] = useState("");

  const selectPilgrims = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPilgrims((prevData) => [...prevData, id]);
    } else {
      setSelectedPilgrims((prevData) => prevData.filter((item) => item !== id));
    }
  };

  const bulkUpdateDepartureYear = async () => {
    if (selectedPilgrims.length === 0)
      alert("Pilih jemaah haji terlebih dahulu");
    else if (yearPilgrims === "")
      alert("Masukkan tahun keberangkatan terlebih dahulu");
    else
      try {
        await axios
          .post(`/api/pilgrims/data/bulkUpdate/departureYear`, {
            users: selectedPilgrims,
            year: yearPilgrims,
          })
          .then((res) => {
            if (res.data.success) {
              setMessage("Berhasil mengubah tahun keberangkatan");
              pilgrimsData();
            }
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

  const columns = useMemo(
    () => [
      {
        name: "",
        cell: (row: any) => {
          return (
            <input
              type="checkbox"
              className="h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent rounded"
              onChange={(e) =>
                selectPilgrims(row.id, e.target.checked ? true : false)
              }
              // checked={row.user_facility.length > 0}
            />
          );
        },
        width: "30px",
      },
      {
        name: "Aksi",
        cell: (row: any) => {
          return (
            <button
              className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
              onClick={(e) => (window.location.href = `pilgrims/${row.id}`)}
            >
              <FontAwesomeIcon icon={faEye} />
              <span className="ml-1">Detail</span>
            </button>
          );
        },
        width: "125px",
      },
      {
        name: "Nama",
        cell: (row: any) => {
          return (
            <div className="flex flex-col">
              <div>{row.user_profile.name}</div>
              <div>
                <span className="font-light">
                  {row.user_profile.gender == "Laki-laki" ? "Bin" : "Binti"}{" "}
                </span>
                <span>{row.user_profile.nasab_name}</span>
              </div>
            </div>
          );
        },
        width: "200px",
      },
      {
        name: "Nomor Porsi",
        cell: (row: any) => {
          return row.user_profile.portion_number;
        },
        width: "150px",
      },
      {
        name: "Tahun Keberangkatan",
        cell: (row: any) => {
          return row.user_profile.departure_year;
        },
        width: "200px",
      },
      {
        name: "Bank",
        cell: (row: any) => {
          return row.user_profile.bank;
        },
        width: "150px",
      },
      {
        name: "Jenis Kelamin",
        cell: (row: any) => {
          return row.user_profile.gender;
        },
        width: "150px",
      },
      {
        name: "Tempat Lahir",
        cell: (row: any) => {
          return row.user_profile.pob;
        },
        width: "150px",
      },
      {
        name: "Tanggal Lahir",
        cell: (row: any) => {
          return formatDate(row.user_profile.dob);
        },
        width: "150px",
      },
      {
        name: "Alamat",
        cell: (row) => {
          return row.user_profile.street.concat(
            ", Kel. ",
            row.user_profile.subdistrict,
            ", Kec. ",
            row.user_profile.district,
            ", Kota ",
            row.user_profile.city,
            ", ",
            row.user_profile.province,
            ", ",
            row.user_profile.postal_code
          );
        },
        width: "300px",
      },
      {
        name: "Nomor Paspor",
        cell: (row) => {
          return row.user_profile.passport_number;
        },
        width: "150px",
      },
      {
        name: "Nama Paspor",
        cell: (row) => {
          return row.user_profile.passport_name;
        },
        width: "200px",
      },
      {
        name: "Tempat Lahir Paspor",
        cell: (row) => {
          return row.user_profile.passport_pob;
        },
        width: "175px",
      },
      {
        name: "Tanggal Lahir Paspor",
        cell: (row) => {
          return formatDate(row.user_profile.passport_dob);
        },
        width: "175px",
      },
      {
        name: "Tanggal Penerbitan Paspor",
        cell: (row) => {
          return formatDate(row.user_profile.passport_issue_date);
        },
        width: "225px",
      },
      {
        name: "Tanggal Berakhir Paspor",
        cell: (row) => {
          return formatDate(row.user_profile.passport_expiry_date);
        },
        width: "200px",
      },
      {
        name: "Kantor Penerbit Paspor",
        cell: (row) => {
          return row.user_profile.passport_issue_office;
        },
        width: "200px",
      },
      {
        name: "Nomor KTP",
        cell: (row) => {
          return row.user_profile.identity_number;
        },
        width: "175px",
      },
    ],
    []
  );

  const [searchPilgrims, setSearchPilgrims] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.href = "/auth/login";
    else {
      if (!isAuth) checkToken();
    }

    pilgrimsData();
  }, [isAuth, user, pilgrimsData]);

  const tableStyle: {} = dataTableStyle;

  if (loading || !isAuth) return <Loader />;
  return (
    <DashboardLayout pageName="Jemaah Haji" role={user.role}>
      <button
        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none"
        onClick={() => (window.location.href = "pilgrims/add")}
      >
        <FontAwesomeIcon icon={faPlus} />
        <span className="ml-1">Tambah Jemaah Haji Baru</span>
      </button>

      <div className="mt-4 mb-4">
        {message && (
          <Alert type={message.includes("Error") ? "error" : "success"}>
            {message}
          </Alert>
        )}
      </div>

      <div className="w-full mx-auto py-5">
        {pilgrims.length > 0 ? (
          <>
            <div className="mb-2 flex flex-col md:flex-row gap-2 justify-between items-end">
              <input
                type="text"
                value={searchPilgrims}
                onChange={(e) => setSearchPilgrims(e.target.value)}
                placeholder="Cari Nama, No. Porsi, NIK, No. Paspor, atau Tahun Keberangkatan"
                className="w-full lg:w-2/5 h-[35px] rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
              />
              <div className="flex-col">
                <div className="text-xs text-right mb-1">
                  Ubah tahun keberangkatan untuk {selectedPilgrims.length}{" "}
                  jemaah haji
                </div>
                <div className="flex flex-row w-3/7 text-center">
                  <input
                    type="number"
                    value={yearPilgrims}
                    onChange={(e) => setYearPilgrims(e.target.value)}
                    placeholder="Tahun Keberangkatan"
                    className="w-full h-[35px] rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    className="w-2/3 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none ml-2"
                    onClick={() => bulkUpdateDepartureYear()}
                  >
                    Ubah Masal
                  </button>
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={pilgrims.filter((item) => {
                if (searchPilgrims === "") return item;
                else if (
                  multipleDataInclude(
                    [
                      item.user_profile.name,
                      item.user_profile.nasab_name,
                      item.user_profile.portion_number,
                      item.user_profile.passport_number,
                      item.user_profile.identity_number,
                      item.user_profile.departure_year,
                    ],
                    searchPilgrims
                  )
                )
                  return item;
              })}
              pagination={true}
              customStyles={tableStyle}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPilgrims;
