import { padNumbers } from "@/lib/number/format";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateWithTime = (date: string) => {
  let newDate = date.replace("T", " ").slice(0, 19);
  let splitDate = newDate.split("-");
  let year = splitDate[0];
  let month = splitDate[1];
  let day = splitDate[2].split(" ")[0];

  switch (month) {
    case "01":
      month = "Januari";
      break;
    case "02":
      month = "Februari";
      break;
    case "03":
      month = "Maret";
      break;
    case "04":
      month = "April";
      break;
    case "05":
      month = "Mei";
      break;
    case "06":
      month = "Juni";
      break;
    case "07":
      month = "Juli";
      break;
    case "08":
      month = "Agustus";
      break;
    case "09":
      month = "September";
      break;
    case "10":
      month = "Oktober";
      break;
    case "11":
      month = "November";
      break;
    case "12":
      month = "Desember";
      break;
    default:
      month = "Januari";
  }

  return `${day} ${month} ${year} ${splitDate[2].split(" ")[1]}`;
};

const formatDateInput = (timestamp: string) => {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  return year + "-" + month + "-" + day;
};

const dateToPass = (date: string) => {
  return date.substring(0, 10).replace(/-/g, "");
};

const convertToMMYY = (dateString: string) => {
  const date = new Date(dateString);

  const month = padNumbers(date.getMonth() + 1, 2);
  const year = date.getFullYear().toString().slice(-2);

  return `${month}-${year}`;
};

export {
  formatDate,
  formatDateWithTime,
  formatDateInput,
  dateToPass,
  convertToMMYY,
};
