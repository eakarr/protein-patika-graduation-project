import Header from "../../components/Header/Header";
import Email from "../../components/Email/Email";
import Offers from "../../components/Offers/Offers";
import "./Account.scss";
const Account = () => {
  return (
    <div>
      <Header />
      <div className="account-container">
        <Email />
        <Offers />
      </div>
    </div>
  );
};

export default Account;
