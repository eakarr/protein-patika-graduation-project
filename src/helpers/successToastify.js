import { toast } from "react-toastify";
import successIcon from "../assets/success-icon.svg";
import "react-toastify/dist/ReactToastify.css";

const successToastify = (message) => {
  toast.success(message, {
    position: "top-right",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    autoClose: 3000,
    icon: <img alt="Success Icon Toast !important" src={successIcon} />,
  });
};

export default successToastify;