import { dataTableStyle } from "@/lib/dataTable/style";
import Alert from "@/views/components/Alert";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { z } from "zod";

const facilityValidation = z.object({
  name: z.string().min(1, "Nama fasilitas wajib dimasukkan"),
});

const AdminFacilityConfigLayout = ({ id, company_id }: any): JSX.Element => {
  const [message, setMessage] = useState("");

  const [facilityLoading, setFacilityLoading] = useState(true);

  const facilityModel = {
    id: "",
    name: "",
    company_facility_year: [
      {
        id: "",
        year: "",
      },
    ],
  };

  const [facility, setFacility] = useState([facilityModel]);

  const getFacility = useCallback(async () => {
    try {
      await axios.get(`/api/facility/getAll/${company_id}`).then((res) => {
        setFacility(res.data.data);
        setFacilityLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  }, [company_id]);

  const facilityColumns = useMemo(
    () => [
      {
        name: "Aksi",
        cell: (row: any) => {
          return (
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
              onClick={() => deleteFacility(row.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              <span className="ml-1">Hapus</span>
            </button>
          );
        },
        width: "150px",
      },
      {
        name: "Nama Fasilitas",
        cell: (row: any) => {
          return row.name;
        },
      },
      {
        name: "Tahun Keberangkatan",
        cell: (row: any) => {
          return row.company_facility_year.map((item: any, index: any) => (
            <div
              className="bg-blue-500 text-white px-2 py-1 mr-1 rounded"
              key={index}
            >
              {item.year === "ALL" ? "Semua Tahun" : item.year}
            </div>
          ));
        },
      },
    ],
    []
  );

  const [facilityAll, setFacilityAll] = useState(false);

  const [insertFacilityYear, setInsertFacilityYear] = useState<number[]>([0]);

  const addFacilityYearField = () => {
    setInsertFacilityYear((prevData) => [...prevData, 0]);
  };

  const removeFacilityYearField = (index: number) => {
    setInsertFacilityYear((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleFacilityYearChange = (value: string, index: number) => {
    const numericValue = value !== "0" ? value.replace(/^0+/, "") : value;

    const newField = [...insertFacilityYear];
    newField[index] = Number(numericValue);

    setInsertFacilityYear(newField);
  };

  const [insertFacility, setInsertFacility] = useState(facilityModel);
  const [facilityValidationMessage, setFacilityValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const validateInsertFacility = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setFacilityValidationMessage({});

    try {
      facilityValidation.parse({
        name: insertFacility.name,
      });
      handleInsertFacility();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setFacilityValidationMessage(errorMap);
      } else {
        setMessage(`Unknown error`);
      }
    }
  };

  const handleInsertFacility = async () => {
    try {
      const isFacilityAll = !facilityAll;
      await axios
        .post("/api/facility/add", {
          company_id: company_id,
          name: insertFacility.name,
          all_year: isFacilityAll,
          years: insertFacilityYear,
        })
        .then((res) => {
          setMessage(res.data.message);
          setInsertFacility(facilityModel);
          setFacilityAll(false);
          setInsertFacilityYear([0]);
          getFacility();
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

  const deleteFacility = async (id: string) => {
    if (
      confirm(
        "Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan"
      )
    ) {
      try {
        await axios
          .delete("/api/facility/delete", {
            data: {
              id: id,
            },
          })
          .then((res) => {
            setMessage(res.data.message);
            getFacility();
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

  const tableStyle: {} = dataTableStyle;

  useEffect(() => {
    getFacility();
  }, [getFacility]);

  if (facilityLoading) return <div>Loading...</div>;
  return (
    <div className="w-full mb-8">
      <h1 className="text-lg font-bold mb-2">Pengaturan Data Fasilitas</h1>
      <div className="mt-4">
        {message && (
          <Alert type={message.includes("Error") ? "error" : "success"}>
            {message}
          </Alert>
        )}
      </div>
      <div className="mb-2">
        <Disclosure>
          <Disclosure.Button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-1">Tambah Data Pengaturan Fasilitas</span>
          </Disclosure.Button>
          <Disclosure.Panel className="mt-2 text-gray-500 bg-white rounded-lg p-4">
            <form onSubmit={validateInsertFacility}>
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-500"
                >
                  Nama Fasilitas
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                  value={insertFacility.name}
                  onChange={(e) =>
                    setInsertFacility({
                      ...insertFacility,
                      name: e.target.value,
                    })
                  }
                />
                {facilityValidationMessage.name && (
                  <p className="text-red-500 text-sm">
                    {facilityValidationMessage.name}
                  </p>
                )}
              </div>

              <div className="mb-2 flex items-center gap-x-1">
                <input
                  type="checkbox"
                  id="facility_all"
                  className="h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent rounded"
                  checked={facilityAll}
                  onChange={(e) => setFacilityAll(e.target.checked)}
                />
                <label htmlFor="facility_all">
                  Fasilitas ini terbatas untuk tahun keberangkatan tertentu
                </label>
              </div>

              {!facilityAll ? (
                ""
              ) : (
                <div className="mb-2">
                  <label
                    htmlFor="facility_year"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Tahun Keberangkatan
                  </label>
                  {insertFacilityYear.map((item, index) => {
                    return (
                      <div key={index} className="mb-2">
                        <div className="relative">
                          <input
                            type="number"
                            id="facility_year"
                            value={item === 0 ? "0" : item.toString()}
                            onChange={(e) =>
                              handleFacilityYearChange(e.target.value, index)
                            }
                            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 slider-none"
                          />
                          {index !== 0 && (
                            <button
                              type="button"
                              className="absolute top-2 bottom-2 right-3 text-red-500 font-bold uppercase text-xs outline-none focus:outline-none px-3"
                              onClick={() => removeFacilityYearField(index)}
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={addFacilityYearField}
                    className="text-blue-500 active:text-blue-600 font-bold uppercase text-xs py-1 rounded outline-none focus:outline-none"
                  >
                    Tambah Kolom Tahun Keberangkatan
                  </button>
                </div>
              )}
              <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                <FontAwesomeIcon icon={faPlus} />
                <span className="ml-2">Tambah</span>
              </button>
            </form>
          </Disclosure.Panel>
        </Disclosure>
      </div>
      {facility.length > 0 ? (
        <DataTable
          columns={facilityColumns}
          data={facility}
          pagination={true}
          customStyles={tableStyle}
        />
      ) : (
        "Tidak ada data fasilitas"
      )}
    </div>
  );
};

export default AdminFacilityConfigLayout;
