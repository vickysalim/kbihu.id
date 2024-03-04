import { dataTableStyle } from "@/lib/dataTable/style";
import Alert from "@/views/components/Alert";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { z } from "zod";

const documentValidation = z.object({
  name: z.string().min(1, "Nama dokumen wajib dimasukkan"),
});

const AdminDocumentConfigLayout = ({ id, company_id }: any): JSX.Element => {
  const [message, setMessage] = useState("");

  const [documentLoading, setDocumentLoading] = useState(true);

  const documentModel = {
    id: "",
    name: "",
    company_document_year: [
      {
        id: "",
        year: "",
      },
    ],
  };

  const [document, setDocument] = useState([documentModel]);

  const getDocument = useCallback(async () => {
    try {
      await axios.get(`/api/document/getAll/${company_id}`).then((res) => {
        setDocument(res.data.data);
        setDocumentLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  }, [company_id]);

  const documentColumns = useMemo(
    () => [
      {
        name: "Aksi",
        cell: (row: any) => {
          return (
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1"
              onClick={() => deleteDocument(row.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              <span className="ml-1">Hapus</span>
            </button>
          );
        },
        width: "150px",
      },
      {
        name: "Nama Dokumen",
        cell: (row: any) => {
          return row.name;
        },
      },
      {
        name: "Tahun Keberangkatan",
        cell: (row: any) => {
          return row.company_document_year.map((item: any, index: any) => (
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

  const [documentAll, setDocumentAll] = useState(false);

  const [insertDocumentYear, setInsertDocumentYear] = useState<number[]>([0]);

  const addDocumentYearField = () => {
    setInsertDocumentYear((prevData) => [...prevData, 0]);
  };

  const removeDocumentYearField = (index: number) => {
    setInsertDocumentYear((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleDocumentYearChange = (value: string, index: number) => {
    const numericValue = value !== "0" ? value.replace(/^0+/, "") : value;

    const newField = [...insertDocumentYear];
    newField[index] = Number(numericValue);

    setInsertDocumentYear(newField);
  };

  const [insertDocument, setInsertDocument] = useState(documentModel);
  const [documentValidationMessage, setDocumentValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const validateInsertDocument = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setDocumentValidationMessage({});

    try {
      documentValidation.parse({
        name: insertDocument.name,
      });
      handleInsertDocument();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setDocumentValidationMessage(errorMap);
      } else {
        setMessage(`Unknown error`);
      }
    }
  };

  const handleInsertDocument = async () => {
    try {
      const isDocumentAll = !documentAll;
      await axios
        .post("/api/document/add", {
          company_id: company_id,
          name: insertDocument.name,
          all_year: isDocumentAll,
          years: insertDocumentYear,
        })
        .then((res) => {
          setMessage(res.data.message);
          setInsertDocument(documentModel);
          setDocumentAll(false);
          setInsertDocumentYear([0]);
          getDocument();
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

  const deleteDocument = async (id: string) => {
    if (
      confirm(
        "Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan"
      )
    ) {
      try {
        await axios
          .delete("/api/document/delete", {
            data: {
              id: id,
            },
          })
          .then((res) => {
            setMessage(res.data.message);
            getDocument();
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
    getDocument();
  }, [getDocument]);

  if (documentLoading) return <div>Loading...</div>;
  return (
    <div className="w-full mb-8">
      <h1 className="text-lg font-bold mb-2">Pengaturan Data Dokumen</h1>
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
            <span className="ml-1">Tambah Data Pengaturan Dokumen</span>
          </Disclosure.Button>
          <Disclosure.Panel className="mt-2 text-gray-500 bg-white rounded-lg p-4">
            <form onSubmit={validateInsertDocument}>
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-500"
                >
                  Nama Dokumen
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                  value={insertDocument.name}
                  onChange={(e) =>
                    setInsertDocument({
                      ...insertDocument,
                      name: e.target.value,
                    })
                  }
                />
                {documentValidationMessage.name && (
                  <p className="text-red-500 text-sm">
                    {documentValidationMessage.name}
                  </p>
                )}
              </div>

              <div className="mb-2 flex items-center gap-x-1">
                <input
                  type="checkbox"
                  id="document_all"
                  className="h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent rounded"
                  checked={documentAll}
                  onChange={(e) => setDocumentAll(e.target.checked)}
                />
                <label htmlFor="document_all">
                  Dokumen ini terbatas untuk tahun keberangkatan tertentu
                </label>
              </div>

              {!documentAll ? (
                ""
              ) : (
                <div className="mb-2">
                  <label
                    htmlFor="document_year"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Tahun Keberangkatan
                  </label>
                  {insertDocumentYear.map((item, index) => {
                    return (
                      <div key={index} className="mb-2">
                        <div className="relative">
                          <input
                            type="number"
                            id="document_year"
                            value={item === 0 ? "0" : item.toString()}
                            onChange={(e) =>
                              handleDocumentYearChange(e.target.value, index)
                            }
                            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 slider-none"
                          />
                          {index !== 0 && (
                            <button
                              type="button"
                              className="absolute top-2 bottom-2 right-3 text-red-500 font-bold uppercase text-xs outline-none focus:outline-none px-3"
                              onClick={() => removeDocumentYearField(index)}
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
                    onClick={addDocumentYearField}
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
      {document.length > 0 ? (
        <DataTable
          columns={documentColumns}
          data={document}
          pagination={true}
          customStyles={tableStyle}
        />
      ) : (
        "Tidak ada data dokumen"
      )}
    </div>
  );
};

export default AdminDocumentConfigLayout;
