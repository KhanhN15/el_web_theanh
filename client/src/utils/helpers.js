import moment from "moment";

export const formatDate = (timestamp) => {
  return moment(timestamp).format("h:mm A => DD/MM/YYYY");
};

export const dataLocalStorage = () => {
  const localData = localStorage.getItem("user");
  if (!localData) {
    return;
  }
  return JSON.parse(localData);
};
