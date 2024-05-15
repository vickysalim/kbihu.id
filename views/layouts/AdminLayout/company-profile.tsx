import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const validation = z.object({
  name: z.string().min(1, { message: `Nama KBIHU wajib dimasukkan` }),
  street: z.string().min(1, { message: `Alamat wajib dimasukkan` }),
  district: z.string().min(1, { message: `Kecamatan wajib dimasukkan` }),
  subdistrict: z.string().min(1, { message: `Kelurahan wajib dimasukkan` }),
  city: z.string().min(1, { message: `Kota wajib dimasukkan` }),
  province: z.string().min(1, { message: `Provinsi wajib dimasukkan` }),
  postal_code: z.coerce
    .number()
    .min(1, { message: `Kode pos wajib dimasukkan` }),
  phone_number: z
    .string()
    .min(1, { message: `Nomor telepon wajib dimasukkan` }),
  leader: z.string().min(1, { message: `Pimpinan wajib dimasukkan` }),
  license: z.string().min(1, { message: `Nomor izin wajib dimasukkan` }),
});

const isBrowser = () => typeof window !== "undefined";

const validationLogo = isBrowser()
  ? z.object({
      logo: z.instanceof(File, { message: `Logo wajib dimasukkan` }),
    })
  : z.object({
      logo: z.any(),
    });

const validationGallery = isBrowser()
  ? z.object({
      gallery: z.instanceof(File, { message: `Foto KBIHU wajib dimasukkan` }),
    })
  : z.object({
      gallery: z.any(),
    });

const AdminCompanyProfileLayout: React.FC = ({ id }: any) => {
  const [message, setMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string;
  }>({});
  const [validationLogoMessage, setValidationLogoMessage] = useState<{
    [key: string]: string;
  }>({});
  const [validationGalleryMessage, setValidationGalleryMessage] = useState<{
    [key: string]: string;
  }>({});

  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [leader, setLeader] = useState("");
  const [license, setLicense] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");

  const [companyGallery, setCompanyGallery] = useState("");

  const [logo, setLogo] = useState();

  const [gallery, setGallery] = useState();

  const getCompanyData = async () => {
    try {
      const { data } = await axios.get(`/api/company/get/${id}`);
      const galleryData = await axios.get(`/api/company/get/gallery/${id}`);

      setName(data.data.name);
      setStreet(data.data.street);
      setDistrict(data.data.district);
      setSubdistrict(data.data.subdistrict);
      setCity(data.data.city);
      setProvince(data.data.province);
      setPostalCode(data.data.postal_code);
      setPhoneNumber(data.data.phone_number);
      setLeader(data.data.leader);
      setLicense(data.data.license);
      setCompanyLogo(data.data.company_logo);

      if (galleryData.data.data.length > 0)
        setCompanyGallery(galleryData.data.data[0].photo);
    } catch (error: any) {
      if (error.response) {
        const fieldError = error.response.data.message;
        setMessage(`Error: ${fieldError}`);
      } else {
        setMessage(`Unknown Error: ${error}`);
      }
    }
  };

  const validateEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationMessage({});

    try {
      validation.parse({
        name,
        street,
        district,
        subdistrict,
        city,
        province,
        postal_code: postalCode,
        phone_number: phoneNumber,
        leader,
        license,
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
      const { data } = await axios.put(`/api/company/update/${id}`, {
        name,
        street,
        district,
        subdistrict,
        city,
        province,
        postal_code: postalCode,
        phone_number: phoneNumber,
        leader,
        license,
      });

      setMessage(data.message);
    } catch (error: any) {
      if (error.response) {
        const fieldError = error.response.data.message;
        setMessage(`Error: ${fieldError}`);
      } else {
        setMessage(`Unknown Error`);
      }
    }
  };

  // logo

  const handleChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) setLogo(file);
  };

  const validateEditLogo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationLogoMessage({});

    try {
      validationLogo.parse({ logo });

      handleEditLogo();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setValidationLogoMessage(errorMap);
      } else {
        setMessage(`Unknown error`);
      }
    }
  };

  const handleEditLogo = async () => {
    const formData = new FormData();
    formData.append("file", logo);

    try {
      const data = await axios.put(`/api/company/update/logo/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(data);

      setMessage(data.data.message);
      setCompanyLogo(data.data.data);

      if (logoInputRef.current) logoInputRef.current.value = "";
    } catch (error: any) {
      if (error.response) {
        const fieldError = error.response.data.message;
        setMessage(`Error: ${fieldError}`);
      } else {
        setMessage(`Unknown Error`);
      }
    }
  };

  // gallery

  const handleChangeGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) setGallery(file);
  };

  const validateEditGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationGalleryMessage({});

    try {
      validationGallery.parse({ gallery });

      handleEditGallery();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setValidationGalleryMessage(errorMap);
      } else {
        setMessage(`Unknown error`);
      }
    }
  };

  const handleEditGallery = async () => {
    const formData = new FormData();
    formData.append("file", gallery);

    try {
      const data = await axios.put(
        `/api/company/update/gallery/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(data);

      setMessage(data.data.message);
      setCompanyGallery(data.data.data);

      if (galleryInputRef.current) galleryInputRef.current.value = "";
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
    getCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {message && (
        <p
          className={`${
            message.includes("Error") ? "bg-red-500" : "bg-green-500"
          } text-white mt-2 p-4 rounded-lg`}
        >
          {message}
        </p>
      )}

      <h1 className="text-lg font-bold mb-2">Ubah Profil KBIHU</h1>

      <form onSubmit={validateEdit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-500"
            >
              Nama KBIHU
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.name && (
              <p className="text-sm text-red-500">{validationMessage.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="street"
              className="text-sm font-semibold text-gray-500"
            >
              Alamat
            </label>
            <input
              type="text"
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.street && (
              <p className="text-sm text-red-500">{validationMessage.street}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="district"
              className="text-sm font-semibold text-gray-500"
            >
              Kecamatan
            </label>
            <input
              type="text"
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.district && (
              <p className="text-sm text-red-500">
                {validationMessage.district}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="subdistrict"
              className="text-sm font-semibold text-gray-500"
            >
              Kelurahan
            </label>
            <input
              type="text"
              id="subdistrict"
              value={subdistrict}
              onChange={(e) => setSubdistrict(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.subdistrict && (
              <p className="text-sm text-red-500">
                {validationMessage.subdistrict}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="city"
              className="text-sm font-semibold text-gray-500"
            >
              Kota
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.city && (
              <p className="text-sm text-red-500">{validationMessage.city}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="province"
              className="text-sm font-semibold text-gray-500"
            >
              Provinsi
            </label>
            <input
              type="text"
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.province && (
              <p className="text-sm text-red-500">
                {validationMessage.province}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="postal_code"
              className="text-sm font-semibold text-gray-500"
            >
              Kode Pos
            </label>
            <input
              type="number"
              id="postal_code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.postal_code && (
              <p className="text-sm text-red-500">
                {validationMessage.postal_code}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="phone_number"
              className="text-sm font-semibold text-gray-500"
            >
              Nomor Telepon
            </label>
            <input
              type="text"
              id="phone_number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.phone_number && (
              <p className="text-sm text-red-500">
                {validationMessage.phone_number}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="leader"
              className="text-sm font-semibold text-gray-500"
            >
              Pimpinan
            </label>
            <input
              type="text"
              id="leader"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.leader && (
              <p className="text-sm text-red-500">{validationMessage.leader}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="license"
              className="text-sm font-semibold text-gray-500"
            >
              Nomor Izin KBIHU
            </label>
            <input
              type="text"
              id="license"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            {validationMessage.license && (
              <p className="text-sm text-red-500">
                {validationMessage.license}
              </p>
            )}
          </div>
        </div>
        <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
          <FontAwesomeIcon icon={faPen} />
          <span className="ml-1">Ubah</span>
        </button>
      </form>

      <h1 className="text-lg font-bold mt-8 mb-2">Ubah Logo KBIHU</h1>

      <form onSubmit={validateEditLogo} encType="multipart/form-data">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="logo"
              className="text-sm font-semibold text-gray-500"
            >
              Logo KBIHU
            </label>

            <div className="flex items-center">
              <input
                type="file"
                id="logo"
                ref={logoInputRef}
                onChange={handleChangeLogo}
                className="bg-white p-2 w-full text-slate-500 text-sm rounded-lg leading-6 border border-gray-300 focus:border-blue-500 file:bg-blue-500 file:text-white file:font-bold file:font-uppercase file:text-xs file:px-4 file:py-1 file:active:bg-blue-600 file:border-none file:mr-4 file:rounded"
              />
            </div>
            {validationLogoMessage.logo && (
              <p className="text-sm text-red-500">
                {validationLogoMessage.logo}
              </p>
            )}
            {companyLogo && (
              <img
                src={`/upload_files/profile_pic/${companyLogo}`}
                alt="logo"
                className="w-16 object-contain my-2"
              />
            )}
          </div>
        </div>
        <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
          <FontAwesomeIcon icon={faPen} />
          <span className="ml-1">Ubah</span>
        </button>
      </form>

      <h1 className="text-lg font-bold mt-8 mb-2">Ubah Foto KBIHU</h1>

      <form onSubmit={validateEditGallery} encType="multipart/form-data">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="gallery"
              className="text-sm font-semibold text-gray-500"
            >
              Foto KBIHU
            </label>

            <div className="flex items-center">
              <input
                type="file"
                id="gallery"
                ref={galleryInputRef}
                onChange={handleChangeGallery}
                className="bg-white p-2 w-full text-slate-500 text-sm rounded-lg leading-6 border border-gray-300 focus:border-blue-500 file:bg-blue-500 file:text-white file:font-bold file:font-uppercase file:text-xs file:px-4 file:py-1 file:active:bg-blue-600 file:border-none file:mr-4 file:rounded"
              />
            </div>
            {validationGalleryMessage.gallery && (
              <p className="text-sm text-red-500">
                {validationGalleryMessage.gallery}
              </p>
            )}
            {companyGallery && (
              <img
                src={`/upload_files/company_photo/${companyGallery}`}
                alt="galleryPhoto"
                className="w-16 object-contain my-2"
              />
            )}
          </div>
        </div>
        <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
          <FontAwesomeIcon icon={faPen} />
          <span className="ml-1">Ubah</span>
        </button>
      </form>
    </>
  );
};

export default AdminCompanyProfileLayout;
