import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const AdminHelpDeskLayout = () => {
  const [phoneNumber] = useState("6281258240640");
  return (
    <>
      <div>
        Jika Anda mengalami kendala seputar KBIHU.ID, silakan lakukan pelaporan
        dengan memilih salah satu opsi berikut sesuai dengan kendala yang Anda
        hadapi.
      </div>
      <div className="bg-white mt-4 mb-2 rounded-lg">
        <div
          className="py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
          onClick={() =>
            window.open(
              `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Saya%20ingin%20melaporkan%20kendala%20terkait%20kesalahan%20atau%20gangguan%20pada%20sistem.%0A%0ANama%3A%0AKBIHU%3A%0AKronologi%20Permasalahan%3A%0A%0AMohon%20untuk%20ditindaklanjuti.%20Terima%20kasih.`,
              "_blank"
            )
          }
        >
          <div className="flex flex-row">
            <div>Kesalahan atau Gangguan pada Sistem KBIHU.ID</div>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
        </div>

        <div
          className="py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
          onClick={() =>
            window.open(
              `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Saya%20ingin%20melaporkan%20kendala%20terkait%20kesalahan%20penghapusan%20data.%0A%0ANama%3A%0AKBIHU%3A%0AKronologi%20Permasalahan%3A%0A%0AMohon%20untuk%20ditindaklanjuti.%20Terima%20kasih.`,
              "_blank"
            )
          }
        >
          <div className="flex flex-row">
            <div>Kesalahan Penghapusan Data</div>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
        </div>

        <div
          className="py-3 mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
          onClick={() =>
            window.open(
              `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Saya%20ingin%20melaporkan%20kendala%20terkait%20aplikasi.%0A%0ANama%3A%0AKBIHU%3A%0ALaporan%3A%0A%0AMohon%20untuk%20ditindaklanjuti.%20Terima%20kasih.`,
              "_blank"
            )
          }
        >
          <div className="flex flex-row">
            <div>Lainnya</div>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
        </div>
      </div>
    </>
  );
};

export default AdminHelpDeskLayout;
