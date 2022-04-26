import { toast } from "react-toastify";
import errorIcon from "../assets/error-icon.svg";
import "react-toastify/dist/ReactToastify.css";

const errorToastify = (message) => {
  toast.error(message, {
    position: "top-right",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    autoClose: 3000,
    icon: <img alt="Error Icon Toast" src={errorIcon} />,
  });
};

export default errorToastify;
