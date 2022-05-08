import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import Modal from "react-modal/lib/components/Modal";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";

import "./ProductDetails.scss";
import crossIcon from "../../assets/cross-icon.svg";
import successToastify from "../../helpers/successToastify";

const ProductDetails = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [hasOffered, setHasOffered] = useState(false);
  const [givenOffers, setGivenOffers] = useState([]);
  const [isBuyModalOpened, setIsBuyModalOpened] = useState(false);
  const [isOfferModalOpened, setIsOfferModalOpened] = useState(false);
  const [price, setPrice] = useState();
  const [offerId, setOfferId] = useState();
  const [userAccountId, setUserAccountId] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const ratioOne = useRef(null);
  const ratioTwo = useRef(null);
  const ratioThree = useRef(null);

  const ratioDisabler = () => {
    ratioOne.current.className = "disabled";
    ratioTwo.current.className = "disabled";
    ratioThree.current.className = "disabled";
  };

  const ratioEnabler = () => {
    ratioOne.current.className = "enabled";
    ratioTwo.current.className = "enabled";
    ratioThree.current.className = "enabled";
    setPrice("");
  };

  // Get product details
  const getProductDetails = async () => {
    await api
      .get(`/products/${id}`)
      .then((response) => {
        setProductDetails(response);
        setGivenOffers(response.data.offers);
        console.log("Product detail fetch", response);
      })
      .catch((error) => {
        console.log("Product detail fetch problem: ", error);
      });
  };

  // Get account id request
  const getAccountUserId = async () => {
    await api
      .get("/users/me")
      .then((response) => {
        setUserAccountId(response.data.id);
        console.log("My ID: ", response.data.id);
      })
      .catch((error) => {
        console.log("Product detail fetch problem: ", error);
      });
  };

  useEffect(() => {
    getProductDetails();
    if (Cookies.get("email") && Cookies.get("AccessToken")) {
      getAccountUserId();
    }
  }, []);

  // Put purchase request
  const putPurchaseProduct = async () => {
    const productStatus = { isSold: true, isStatus: null };
    await api
      .put(`/products/${id}`, productStatus)
      .then((response) => {
        if (response.status === 200) {
          successToastify("Satın Alındı");
        }
        console.log("Product purchase completed", response);
      })
      .catch((error) => {
        console.log("Product purchase problem: ", error);
      });
  };

  const purchaseProductHandler = () => {
    putPurchaseProduct();
    setIsBuyModalOpened(false);
    getProductDetails();
  };

  // Post offer request
  const postOfferPrice = async () => {
    const data = {
      product: id,
      users_permissions_user: userAccountId,
      offerPrice: Number(price),
      isStatus: null,
    };
    await api
      .post(`/offers?${id}`, data)
      .then((response) => {
        if (response.status === 200) {
          successToastify("Teklif Verildi");
        }
        setOfferId(response.data.id);
        console.log("Product price offer complete", response);
      })
      .catch((error) => {
        console.log("Product price offer problem: ", error);
      });
  };

  const postOfferPriceHandler = () => {
    postOfferPrice();
    toggleOfferModalHandler();
    setHasOffered(true);
  };

  // Render offer price
  useEffect(() => {
    if (offerId) {
      getProductDetails();
    }
  }, [offerId]);

  useEffect(() => {
    givenOffers.map((myOffer) => {
      if (myOffer.users_permissions_user === userAccountId && myOffer.id) {
        setHasOffered(true);
        setOfferId(myOffer.id);
      }
      return myOffer;
    });
  }, [givenOffers]);

  // Delete offer request
  const deleteCancelOffer = async () => {
    await api
      .delete(`/offers/${offerId}`)
      .then((response) => {
        if (response.status === 200) {
          successToastify("Teklif Geri Çekildi");
        }
        console.log("Product price offer cancel completed", response);
      })
      .catch((error) => {
        console.log("Product price offer cancel problem: ", error);
      });
  };

  const cancelOfferButtonHandler = () => {
    deleteCancelOffer();
    setHasOffered(false);
  };

  // Modal toggles
  const toggleBuyModalHandler = () => {
    if (Cookies.get("email") && Cookies.get("AccessToken")) {
      setIsBuyModalOpened((prevState) => !prevState);
    } else {
      navigate("/login");
    }
  };

  const toggleOfferModalHandler = () => {
    if (Cookies.get("email") && Cookies.get("AccessToken")) {
      setIsOfferModalOpened((prevState) => !prevState);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Header />
      {/* Loading spin */}
      {productDetails.status !== 200 && (
        <div className="loading">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
      {productDetails.status === 200 && (
        <div className="product-detail-container">
          <div className="detail-card-container">
            <div className="detail-card-image">
              <img
                alt="Product"
                src={
                  "https://bootcamp.akbolat.net" +
                  productDetails?.data?.image?.url
                }
              />
            </div>
            <div className="product-details">
              <div className="product-details-name">
                {productDetails.data.name}
              </div>
              <div className="mobile-prices">
                <div className="product-details-price-mobile">
                  {productDetails.data.price} TL
                </div>
                {productDetails.data.isOfferable &&
                  hasOffered &&
                  givenOffers.map(
                    (item) =>
                      item.id === offerId && (
                        <div
                          className="given-offers-price-mobile"
                          key={Math.random()}
                        >
                          <span>Verilen Teklif: </span>
                          {item.offerPrice} TL
                        </div>
                      )
                  )}
              </div>
              <div className="product-details-brand">
                <span>Marka:</span>
                {productDetails.data.brand}
              </div>
              <div className="product-details-color">
                <span>Renk:</span>
                {productDetails.data.color}
              </div>
              <div className="product-details-status">
                <span>Kullanım Durumu:</span>
                {productDetails.data.status}
              </div>
              <div className="product-details-price">
                {productDetails.data.price} TL
              </div>
              {productDetails.data.isOfferable &&
                hasOffered &&
                productDetails.data.users_permissions_user.id !==
                  userAccountId &&
                givenOffers.map(
                  (item) =>
                    item.id === offerId && (
                      <div
                        className="product-details-given-offer-price"
                        key={Math.random()}
                      >
                        <span>Verilen Teklif: </span>
                        {item.offerPrice} TL
                      </div>
                    )
                )}
              <div className="product-details-buttons">
                {productDetails.data.users_permissions_user.id !==
                  userAccountId && (
                  <>
                    {productDetails.data.isSold ? (
                      <div className="bought-product">
                        Bu Ürün Satışta Değil
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={toggleBuyModalHandler}
                          id="buy-button"
                          className="button"
                        >
                          Satın Al
                        </button>
                        {/* Modal of buy part */}
                        <Modal
                          isOpen={isBuyModalOpened}
                          className="buy-modal"
                          ariaHideApp={false}
                        >
                          <p className="buy-text">Satın Al</p>
                          <p className="buy-question-text">
                            Satın Almak istiyor musunuz?
                          </p>
                          <div className="buy-modal-buttons">
                            <button
                              onClick={toggleBuyModalHandler}
                              className="button-secondary"
                            >
                              Vazgeç
                            </button>
                            <button
                              onClick={purchaseProductHandler}
                              className="button"
                            >
                              Satın Al
                            </button>
                          </div>
                        </Modal>
                        {productDetails.data.isOfferable && hasOffered ? (
                          <button
                            onClick={cancelOfferButtonHandler}
                            className="button-secondary"
                            id="cancel-offer-button"
                          >
                            Teklifi Geri Çek
                          </button>
                        ) : (
                          <>
                            {productDetails.data.isOfferable && (
                              <button
                                onClick={toggleOfferModalHandler}
                                id="offer-button"
                                className="button-secondary"
                              >
                                Teklif Ver
                              </button>
                            )}
                            {/* Modal of offer part  */}
                            <Modal
                              isOpen={isOfferModalOpened}
                              className="offer-modal"
                              ariaHideApp={false}
                            >
                              <div className="offer-modal-title-wrapper">
                                <p className="offer-modal-title">Teklif Ver</p>
                                <img
                                  src={crossIcon}
                                  alt="Close Button"
                                  onClick={toggleOfferModalHandler}
                                />
                              </div>
                              <div className="offer-modal-product-details">
                                <div className="offer-modal-upside">
                                  <div className="offer-modal-image">
                                    <img
                                      src={
                                        "https://bootcamp.akbolat.net" +
                                        productDetails?.data?.image?.url
                                      }
                                      alt={productDetails.data.name}
                                    />
                                  </div>
                                  <div className="offer-modal-product">
                                    <div className="offer-modal-product-title">
                                      {productDetails.data.name}
                                    </div>
                                    <div className="offer-modal-product-price">
                                      {productDetails.data.price} TL
                                    </div>
                                  </div>
                                </div>
                                <form
                                  onSubmit={handleSubmit(postOfferPriceHandler)}
                                >
                                  <div
                                    className="offer-modal-options"
                                    onClick={ratioEnabler}
                                  >
                                    <div className="offer-modal-radio">
                                      <input
                                        type="radio"
                                        name="radio-group"
                                        ref={ratioOne}
                                        onChange={() => {
                                          setPrice((
                                            0.2 * productDetails.data.price
                                          ).toFixed(2));
                                        }}
                                      />
                                      <label>%20'si Kadar Teklif Ver</label>
                                    </div>
                                    <div className="offer-modal-radio">
                                      <input
                                        type="radio"
                                        name="radio-group"
                                        ref={ratioTwo}
                                        onChange={() => {
                                          setPrice((
                                            0.3 * productDetails.data.price
                                          ).toFixed(2));
                                        }}
                                      />
                                      <label>%30'u Kadar Teklif Ver</label>
                                    </div>
                                    <div className="offer-modal-radio">
                                      <input
                                        type="radio"
                                        name="radio-group"
                                        ref={ratioThree}
                                        onChange={() => {
                                          setPrice((
                                            0.4 * productDetails.data.price
                                          ).toFixed(2));
                                        }}
                                      />
                                      <label>%40'ı Kadar Teklif Ver</label>
                                    </div>
                                  </div>
                                  <div className="offer-modal-price">
                                    <input
                                      className="input"
                                      type="number"
                                      value={price}
                                      placeholder="Teklif Belirle"
                                      onFocus={ratioDisabler}
                                      id={errors.price && "price-error"}
                                      {...register("price", {
                                        min: 0,
                                      })}
                                      onChange={(event) => {
                                        setPrice(event.target.value);
                                      }}
                                    />
                                    <span id="tl-text">TL</span>
                                  </div>
                                  <div className="offer-modal-button">
                                    <button
                                      id="offer-modal-accept-button"
                                      className="button"
                                    >
                                      Onayla
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </Modal>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="product-details-description">
                <p>Açıklama</p>
                {productDetails.data.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
