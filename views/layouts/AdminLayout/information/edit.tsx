import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";

const validation = z.object({
  title: z.string().min(1, { message: `Judul wajib dimasukkan` }),
  description: z.string().min(1, { message: `Deskripsi wajib dimasukkan` }),
});

const AdminEditInformationLayout = ({
  loadData,
  data,
  setMessage,
}: any): JSX.Element => {
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);

  const validateEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationMessage({});

    try {
      validation.parse({
        title,
        description,
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
        .put(`/api/information/update/${data.id}`, {
          title,
          description,
        })
        .then((res) => {
          setMessage(res.data.message);

          setTitle("");
          setDescription("");
          loadData();
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

  return (
    <>
      <form onSubmit={validateEdit}>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.title && (
              <p className="text-sm text-red-500">{validationMessage.title}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-gray-500"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.description && (
              <p className="text-sm text-red-500">
                {validationMessage.description}
              </p>
            )}
          </div>
        </div>
        <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
          <FontAwesomeIcon icon={faPen} />
          <span className="ml-1">Edit</span>
        </button>
      </form>
    </>
  );
};

export default AdminEditInformationLayout;
