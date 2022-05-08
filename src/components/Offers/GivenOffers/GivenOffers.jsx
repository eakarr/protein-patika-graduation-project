import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../../../services/api";

import successToastify from "../../../helpers/successToastify";
import "./GivenOffers.scss";

const GivenOffers = () => {
  const [givenOffers, setGivenOffers] = useState([]);
  const [accountUserId, setAccountUserId] = useState();
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);

  // Get data request
  const getAccountUserId = async () => {
    await api
      .get(`/users/me`)
      .then((response) => {
        setAccountUserId(response.data.id);
        console.log("Account user id fetch", response.data.id);
      })
      .catch((error) => {
        console.log("Account user id problem: ", error);
      });
  };

  const getGivenOffers = async () => {
    await api
      .get(`/offers?users_permissions_user=${accountUserId}`)
      .then((response) => {
        setGivenOffers(response);
        console.log("Given offers fetch", response);
      })
      .catch((error) => {
        console.log("Given offers fetch problem: ", error);
      });
  };

  useEffect(() => {
    getAccountUserId();
    getGivenOffers();
  }, []);

  useEffect(() => {
    if (
      givenOffers?.data?.product?.isOfferable === false ||
      givenOffers?.data?.product?.isSold === true
    ) {
      getGivenOffers();
    }
  }, [
    givenOffers?.data?.product?.isOfferable,
    givenOffers?.data?.product?.isSold,
  ]);

  // Re-render
  useEffect(() => {
    if (givenOffers.status === 200) {
      getGivenOffers();
    }
  }, [givenOffers.status]);

  // Purchase product
  const putPurchaseProduct = async (id) => {
    const productStatus = { isSold: true, isOfferable: false };
    await api
      .put(`/products/${id}`, productStatus)
      .then((response) => {
        if (response.status === 200) {
          successToastify("Satın Alındı");
        }
        getAccountUserId();
        console.log("Product purchase completed", response);
      })
      .catch((error) => {
        console.log("Product purchase problem: ", error);
      });
  };

  const purchaseProductHandler = (id) => {
    putPurchaseProduct(id);
    setIsOpenBuyModal(false);
  };

  const toggleModalHandler = () => {
    setIsOpenBuyModal((prevState) => !prevState);
  };

  return (
    <div>
      {/* Loading spin */}
      {givenOffers.status !== 200 && (
        <div className="loading-offer">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
      {givenOffers.status === 200 &&
        givenOffers.data?.map((item) => (
          <div key={item.id} className="given-offers-tab">
            <div className="given-offers-image">
              <img
                alt={item?.product?.name}
                src={"https://bootcamp.akbolat.net" + item?.product?.image?.url}
              />
            </div>
            <div className="given-offers-left-side">
              <div className="given-offers-info">
                <div className="given-offers-title">{item?.product?.name}</div>
                <div className="given-offers-price">
                  <span>Verilen Teklif: </span>
                  {item.offerPrice} TL
                </div>
              </div>
              <div className="given-offers-right-side">
                {item?.product?.isSold === true ? (
                  <div className="bought">Satın Alındı</div>
                ) : (
                  <>
                    {item.isStatus === null && (
                      <div className="accepted">Teklif Verildi</div>
                    )}
                    {item.isStatus === false && (
                      <div className="rejected">Reddedildi</div>
                    )}
                    {item.isStatus === true && item.product.isSold === false && (
                      <>
                        <div>
                          <button
                            onClick={toggleModalHandler}
                            id="given-offers-buy-button"
                            className="button"
                          >
                            Satın Al
                          </button>
                        </div>

                        <Modal isOpen={isOpenBuyModal} className="buy-modal">
                          <p className="buy-text">Satın Al</p>
                          <p className="buy-question-text">
                            Satın Almak istiyor musunuz?
                          </p>
                          <div className="buy-modal-buttons">
                            <button
                              onClick={toggleModalHandler}
                              className="button-secondary"
                            >
                              Vazgeç
                            </button>
                            <button
                              onClick={() =>
                                purchaseProductHandler(item.product.id)
                              }
                              className="button"
                            >
                              Satın Al
                            </button>
                          </div>
                        </Modal>
                        <span className="accepted">Onaylandı</span>
                      </>
                    )}
                    {item.isStatus === true && item.product.isSold === true && (
                      <div className="accepted">Satın Alındı</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default GivenOffers;
