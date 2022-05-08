import React, { useEffect, useState } from "react";
import api from "../../../services/api";

import "./ReceivedOffers.scss";

const ReceivedOffers = () => {
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [myId, setMyId] = useState();

  // Fetch data
  const getAccountUserId = async () => {
    await api
      .get(`/users/me`)
      .then((response) => {
        getReceivedOffers(response.data.id); // User id used.
        setMyId(response.data.id)
        // console.log("Account user id fetch", response.data.id);
      })
      .catch((error) => {
        console.log("Account user id problem: ", error);
      });
  };

  const getReceivedOffers = async (id) => {
    await api
      .get(`/products?users_permissions_user=${id}`)
      .then((response) => {
        setReceivedOffers(response);
      })
      .catch((error) => {
        console.log("Received offers problem: ", error);
      });
  };

  useEffect(() => {
    getAccountUserId();
  }, []);
  

  // Accept offer
  const putAcceptOffer = async (offerId) => {
    const productStatus = { isStatus: true };
    await api
      .put(`/offers/${offerId}`, productStatus)
      .then((response) => {
        getReceivedOffers(myId)
        console.log("Accept offer fetch", response);
      })
      .catch((error) => {
        console.log("Accept offer problem: ", error);
      });
  };

  // Reject offer
  const putRejectOffer = async (offerId) => {
    const productStatus = { isStatus: false };
    await api
      .put(`/offers/${offerId}`, productStatus)
      .then((response) => {
        getReceivedOffers(myId)
        console.log("Reject offer fetch", response);
      })
      .catch((error) => {
        console.log("Reject offer problem: ", error);
      });
  };

  return (
    <div>
      {/* {Loading Spin} */}
      {receivedOffers.status !== 200 && (
        <div className="loading-offer">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
      {receivedOffers.status === 200 &&
        receivedOffers.data.map((item) => {
          return item.offers.map((offer) => {
            return (
              <div key={offer.id} className="given-offers-tab">
                <div className="given-offers-image">
                  <img
                    alt={item?.name}
                    src={"https://bootcamp.akbolat.net" + item?.image?.url}
                  />
                </div>
                <div className="given-offers-left-side">
                  <div className="given-offers-info">
                    <div className="given-offers-title">{item?.name}</div>
                    <div className="given-offers-price">
                      <span>Alınan Teklif: </span>
                      {offer.offerPrice} TL
                    </div>
                  </div>
                  <div className="given-offers-right-side">
                    {offer.isStatus === null && item.isSold === false && (
                      <>
                        <button
                          onClick={() => putAcceptOffer(offer.id)}
                          className="button"
                          id="accept-button"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => {
                            putRejectOffer(offer.id);
                          }}
                          className="button"
                          id="refuse-button"
                        >
                          Reddet
                        </button>
                      </>
                    )}
                    {offer.isStatus === true && (
                      <div className="accepted">Onaylandı</div>
                    )}
                    {offer.isStatus === false && (
                      <div className="rejected">Reddedildi</div>
                    )}
                  </div>
                </div>
              </div>
            );
          });
        })}
    </div>
  );
};

export default ReceivedOffers;
