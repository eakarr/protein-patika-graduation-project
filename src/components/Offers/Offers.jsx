import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import GivenOffers from "./GivenOffers/GivenOffers";
import ReceivedOffers from "./ReceivedOffers/ReceivedOffers";
import "./Offers.scss";

const Offers = () => {
  return (
    <div className="offers-tab">
      <Tabs defaultIndex={0}>
        <TabList>
          <Tab>Teklif Aldıklarım</Tab>
          <Tab>Teklif Verdiklerim</Tab>
        </TabList>
        <TabPanel>
          <ReceivedOffers />
        </TabPanel>
        <TabPanel>
          <GivenOffers />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Offers;