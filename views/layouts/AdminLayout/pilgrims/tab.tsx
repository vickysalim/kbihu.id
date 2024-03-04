import axios from "axios";
import { useEffect, useState } from "react";

interface AdminPilgrimsTabLayoutProps {
  activeTab: "data" | "payment" | "document" | "facility";
  id: string | string[] | undefined;
}

const AdminPilgrimsTabLayout = ({
  id,
  activeTab,
}: AdminPilgrimsTabLayoutProps) => {
  const activeTabStyle = "border-b-blue-500 text-blue-500";
  const inactiveTabStyle = "text-slate-800";

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

  const pilgrimsData = async () => {
    if (id != undefined) {
      try {
        await axios.get(`/api/pilgrims/data/get/${id}`).then((res) => {
          setPilgrim(res.data.data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    pilgrimsData();
  }, [id, pilgrim]);
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-4 bg-white p-4 md:px-8 py-4 rounded-lg gap-2">
        <div className="flex flex-col">
          <div className="font-semibold text-xl">
            {pilgrim.user_profile.name}
          </div>
          <div className="text-sm">Nama Jemaah Haji</div>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-xl">
            {pilgrim.user_profile.portion_number}
          </div>
          <div className="text-sm">Nomor Porsi</div>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-xl">
            {pilgrim.user_profile.departure_year}
          </div>
          <div className="text-sm">Tahun Keberangkatan</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <button
          className={`border-b-4 ${
            activeTab == "data" ? activeTabStyle : inactiveTabStyle
          } rounded-lg p-2 mb-4 text-center font-semibold`}
          onClick={() => (window.location.href = `/dashboard/pilgrims/${id}`)}
        >
          Data Jemaah Haji
        </button>
        <button
          className={`border-b-4 ${
            activeTab == "payment" ? activeTabStyle : inactiveTabStyle
          } rounded-lg p-2 mb-4 text-center font-semibold`}
          onClick={() =>
            (window.location.href = `/dashboard/pilgrims/payment/${id}`)
          }
        >
          Data Pembayaran
        </button>
        <button
          className={`border-b-4 ${
            activeTab == "document" ? activeTabStyle : inactiveTabStyle
          } rounded-lg p-2 mb-4 text-center font-semibold`}
          onClick={() =>
            (window.location.href = `/dashboard/pilgrims/document/${id}`)
          }
        >
          Data Dokumen
        </button>
        <button
          className={`border-b-4 ${
            activeTab == "facility" ? activeTabStyle : inactiveTabStyle
          } rounded-lg p-2 mb-4 text-center font-semibold`}
          onClick={() =>
            (window.location.href = `/dashboard/pilgrims/facility/${id}`)
          }
        >
          Data Fasilitas
        </button>
      </div>
    </>
  );
};

export default AdminPilgrimsTabLayout;
