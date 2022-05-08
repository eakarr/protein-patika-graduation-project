import React, { useEffect, useCallback, useState } from "react";
import Header from "../../components/Header/Header";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useDropzone } from "react-dropzone";

import uploadCloudIcon from "../../assets/upload-cloud-icon.svg";
import "./UploadProduct.scss";

const acceptedFileTypes = {
  "image/jpg": [],
  "image/jpeg": [],
  "image/png": [],
};

const UploadProduct = () => {
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState([]);
  const [accountUserId, setAccountUserId] = useState(null);
  const [formObject, setFormObject] = useState({
    name: "",
    description: "",
    category: {
      name: "",
      id: "",
    },
    brand: "",
    color: "",
    status: "",
    price: "",
    isOfferable: false,
    isSold: false,
    users_permissions_user: "",
  });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Image drag/drop part
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles[0]);
    setImageFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    accept: acceptedFileTypes,
    maxSize: 400000,
  });

  // Account user id request
  const getAccountUserId = async () => {
    await api
      .get("/users/me")
      .then((response) => {
        setAccountUserId(response.data.id);
        // console.log("Account user id fetch completed: ", response.data.id);
      })
      .catch((error) => {
        console.log("Account user id fetch problem: ", error);
      });
  };

  // Category request
  const getCategories = async () => {
    await api
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
        // console.log("Category fetch completed: ", response.data);
      })
      .catch((error) => {
        console.log("Category fetch problem: ", error);
      });
  };

  // Brand request
  const getBrands = async () => {
    await api
      .get("/brands")
      .then((response) => {
        setBrands(response.data);
        // console.log("Brands fetch completed: ", response.data);
      })
      .catch((error) => {
        console.log("Brands fetch problem: ", error);
      });
  };

  // Color request
  const getColors = async () => {
    await api
      .get("/colors")
      .then((response) => {
        setColors(response.data);
        // console.log("Color fetch completed: ", response.data);
      })
      .catch((error) => {
        console.log("Color fetch problem: ", error);
      });
  };

  // Status request
  const getStatuses = async () => {
    await api
      .get("/using-statuses")
      .then((response) => {
        setStatus(response.data);
        // console.log("Status fetch completed: ", response.data);
      })
      .catch((error) => {
        console.log("Status fetch problem: ", error);
      });
  };

  // Fecthing all the data
  useEffect(() => {
    getCategories();
    getBrands();
    getColors();
    getStatuses();
    getAccountUserId();
  }, []);

  // Get categories from select input
  useEffect(() => {
    categories.map((item) => {
      if (formObject.category.name === item.name) {
        setFormObject({
          ...formObject,
          category: { ...formObject.category, id: item.id },
        });
      }
      return item;
    });
  }, [formObject.category.name]);

  // Post product request
  const postCreatedProduct = async () => {
    const formData = new FormData();
    formData.append("files.image", imageFile);
    const createProductData = {
      name: formObject.name,
      description: formObject.description,
      category: {
        name: formObject.category.name,
        id: formObject.category.id,
      },
      brand: formObject.brand,
      color: formObject.color,
      status: formObject.status,
      price: formObject.price,
      isOfferable: formObject.isOfferable,
      isSold: false,
      users_permissions_user: accountUserId,
    };
    formData.append("data", JSON.stringify(createProductData));
    await api
      .post("https://bootcamp.akbolat.net/products", formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      })
      .then((response) => {
        console.log(response);
        navigate(`/products/${response.data.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = () => {
    postCreatedProduct();
  };

  return (
    <div className="upload-product">
      <Header />
      <div className="upload-product-container">
        <p id="product-detail-p">Ürün Detayları</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="product-detail-form">
            <div className="left-side-form">
              <label htmlFor="productName">Ürün Adı</label>
              <input
                type="text"
                className="input"
                placeholder="Örnek: Iphone 12 Pro Max"
                id={errors.productName && "upload-product-name-error"}
                {...register("productName", {
                  required: true,
                  maxLength: 100,
                })}
                onChange={(e) => {
                  setFormObject({ ...formObject, name: e.target.value });
                }}
              />

              <label htmlFor="explanation">Açıklama</label>
              <textarea
                className="input description-input"
                placeholder="Ürün açıklaması girin"
                id={
                  errors.productDescription &&
                  "upload-product-description-error"
                }
                {...register("productDescription", {
                  required: true,
                  maxLength: 500,
                })}
                onChange={(e) => {
                  if (e.target.value !== undefined)
                    setFormObject({
                      ...formObject,
                      description: e.target.value,
                    });
                }}
              />

              {/* Products selections from data */}
              <div className="select-box-first-line">
                <div className="select-box-first-line-category">
                  <label htmlFor="category">Kategori</label>
                  <select
                    className={`input ${
                      errors.productCategory && "upload-product-category-error"
                    }`}
                    name="kategori"
                    {...register("productCategory", {
                      required: true,
                    })}
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.value !== undefined)
                        setFormObject({
                          ...formObject,
                          category: {
                            ...formObject.category,
                            name: e.target.value,
                          },
                        });
                    }}
                  >
                    <option value="" disabled selected hidden>
                      Kategori Seç
                    </option>
                    {categories.map((category) => (
                      <option value={category.name} key={category.id}>
                        {category.name.charAt(0).toUpperCase() +
                          category.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-box-first-line-brand">
                  <label htmlFor="marka">Marka</label>
                  <select
                    className={`input ${
                      errors.productBrand && "upload-product-brand-error"
                    }`}
                    name="marka"
                    {...register("productBrand", {
                      required: true,
                    })}
                    onChange={(e) => {
                      if (e.target.value !== undefined)
                        setFormObject({
                          ...formObject,
                          brand: e.target.value,
                        });
                    }}
                  >
                    <option value="" disabled selected hidden>
                      Marka Seç
                    </option>
                    {brands.map((brand) => (
                      <option value={brand.name} key={brand.id}>
                        {brand.name.charAt(0).toUpperCase() +
                          brand.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="select-box-second-line">
                <div className="select-box-second-line-color">
                  <label htmlFor="renk">Renk</label>
                  <select
                    className={`input ${
                      errors.productColor && "upload-product-color-error"
                    }`}
                    name="renk"
                    {...register("productColor", {
                      required: "select one option",
                    })}
                    onChange={(e) => {
                      if (e.target.value !== undefined)
                        setFormObject({
                          ...formObject,
                          color: e.target.value,
                        });
                    }}
                  >
                    <option value="" disabled selected hidden>
                      Renk Seç
                    </option>
                    {colors.map((color) => (
                      <option value={color.name} key={color.id}>
                        {color.name.charAt(0).toUpperCase() +
                          color.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-box-second-line-status">
                  <label htmlFor="kullanımdurumu">Kullanım Durumu</label>
                  <select
                    className={`input ${
                      errors.productStatus && "upload-product-status-error"
                    }`}
                    name="kullanımdurumu"
                    {...register("productStatus", {
                      required: "select one option",
                    })}
                    onChange={(e) => {
                      if (e.target.value !== undefined)
                        setFormObject({
                          ...formObject,
                          status: e.target.value,
                        });
                    }}
                  >
                    <option value="" disabled selected hidden>
                      Kullanım Durumu
                    </option>
                    {status.map((status) => (
                      <option value={status.name} key={status.id}>
                        {status.name.charAt(0).toUpperCase() +
                          status.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div id="product-detail-form-price-input">
                <label htmlFor="fiyat">Fiyat</label>
                <input
                  id={errors.productName && "upload-product-name-error"}
                  {...register("productPrice", {
                    required: "true",
                    min: 0,
                  })}
                  className="input"
                  type="number"
                  placeholder="Bir fiyat girin"
                  onChange={(e) => {
                    setFormObject({ ...formObject, price: e.target.value });
                  }}
                />
                <span id="tl">TL</span>
              </div>

              {/* Offer option */}
              <div className="offer-option-wrapper">
                <span id="offer-option">Teklif opsiyonu </span>
                <input
                  onChange={(e) => {
                    setFormObject({
                      ...formObject,
                      isOfferable: e.target.checked,
                    });
                  }}
                  type="checkbox"
                  className="toggle"
                />
              </div>
            </div>

            <div className="right-side-form">
              {/* Upload and preview image  */}
              {!imageFile && (
                <div className="upload-image">
                  <p id="product-image-p">Ürün Görseli</p>
                  <div className="image-area" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img src={uploadCloudIcon} alt="cloud" />
                    <p id="info-p">Sürükleyip bırakarak yükle</p>
                    <p>veya</p>
                    <button id="choose-image-button" onClick={open}>
                      Görsel Seçin
                    </button>
                    <p>PNG ve JPEG Dosya boyutu max. 400kb</p>
                  </div>
                </div>
              )}

              {imageFile && (
                <div className="uploaded-image">
                  <p id="product-image-p">Ürün Görseli</p>
                  <img src={URL.createObjectURL(imageFile)} alt="uploadimage" />
                  <button
                    id="remove-uploaded-image-button"
                    onClick={() => {
                      setImageFile(null);
                    }}
                  >
                    x
                  </button>
                </div>
              )}

              <div className="submit-button">
                <button id="upload-submit-button" className="button">
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
