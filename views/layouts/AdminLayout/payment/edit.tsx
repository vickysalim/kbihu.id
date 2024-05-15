import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { z } from "zod";
import { useRef, useState } from "react";
import axios from "axios";
import { formatDateInput } from "@/lib/date/format";

const validation = z.object({
  transactionDate: z
    .string()
    .min(1, { message: `Tanggal pembayaran wajib dimasukkan` }),
  amount: z.coerce
    .number()
    .min(1, { message: `Jumlah pembayaran wajib dimasukkan` }),
});

const AdminEditPaymentLayout = ({
  loadData,
  data,
  setMessage,
}: any): JSX.Element => {
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});

  const [amount, setAmount] = useState(data.amount);
  const [note, setNote] = useState(data.note);
  const [transactionDate, setTransactionDate] = useState(data.transaction_date);
  const [recipient, setRecipient] = useState(data.recipient);
  const [file, setFile] = useState(data.proof_file);

  const fileInputRef = useRef(null);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const validateEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationMessage({});

    try {
      validation.parse({
        transactionDate,
        amount,
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
      let formData = new FormData();

      formData.append("transactionDate", transactionDate);
      formData.append("amount", amount);
      formData.append("note", note);
      formData.append("recipient", recipient);

      if (file) formData.append("file", file);

      await axios
        .put(`/api/pilgrims/payment/update/${data.id}`, formData)
        .then((res) => {
          setMessage(res.data.message);

          setAmount("");
          setNote("");
          setTransactionDate("");
          setRecipient("");
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
              htmlFor="transactionDate"
              className="text-sm font-semibold text-gray-500"
            >
              Tanggal Pembayaran
            </label>
            <input
              type="date"
              id="transactionDate"
              value={formatDateInput(transactionDate)}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.transactionDate && (
              <p className="text-sm text-red-500">
                {validationMessage.transactionDate}
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
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.amount && (
              <p className="text-sm text-red-500">{validationMessage.amount}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="recipient"
              className="text-sm font-semibold text-gray-500"
            >
              Penerima
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.recipient && (
              <p className="text-sm text-red-500">
                {validationMessage.recipient}
              </p>
            )}
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.note && (
              <p className="text-sm text-red-500">{validationMessage.note}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="file"
              className="text-sm font-semibold text-gray-500"
            >
              Bukti Pembayaran
            </label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleInputFile}
              className="bg-white p-2 w-full text-slate-500 text-sm rounded-lg leading-6 border border-gray-300 focus:border-blue-500 file:bg-blue-500 file:text-white file:font-bold file:font-uppercase file:text-xs file:px-4 file:py-1 file:active:bg-blue-600 file:border-none file:mr-4 file:rounded"
            />
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

export default AdminEditPaymentLayout;
