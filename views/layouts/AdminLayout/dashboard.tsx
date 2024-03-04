import Card from "@/views/components/Card";
import Done from "@/views/components/Done";
import { faBuilding } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";

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
    };

    fetchData();
  }, [companyId]);

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
      <div>Informasi</div>
    </>
  );
};

export default AdminIndexLayout;
