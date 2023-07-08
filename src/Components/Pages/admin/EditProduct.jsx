import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import axios from "axios";
import { URI } from "../../../App";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {VscClose} from "react-icons/vsc"
const EditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const history = useNavigate();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [customize, setCustomize] = useState("");
  const [delivery, setDelivery] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [subCategory, setSubCategory] = useState([
    {
      name: "",
      bodytype: "",
      powertraintype: "",
      transmission: "",
      drivetrain: "",
      range: "",
      power: "",
      acceleration: "",
      fastcharging: "",
      homecharging: "",
      seats: "",
    },
  ]);
  const create = () => {
    setLoading(true);
    let data = JSON.stringify({
      name: name,
      price: price,
      images: images,
      make: make,
      model: model,
      customize: customize,
      delivery: delivery,
      options: subCategory,
    });

    let config = {
      method: "put",
      url: `${URI}/api/v1/admin/product/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setLoading(false);
        if (response.data?.success) {
          toast.success("Product Updated Successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setTimeout(() => {
            history("/admin/products");
          }, 2500);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Something Went Wrong Please Try again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview([...imagesPreview,  reader.result]);
          setImages([...images, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

 
  useEffect(() => {
    if (id) {
      let config = {
        method: "get",
        url: `${URI}/api/v1/product/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          let data = response.data?.product;

          setName(data?.name);
          setPrice(data?.price);
          setImages(data?.images);
          setImagesPreview(data?.images);
          setMake(data?.make);
          setModel(data?.model);
          setCustomize(data?.customize);
          setDelivery(data?.delivery);

          let optionArray = []
          data?.options?.map((item)=>{
            let options =  {
                name: item?.name,
                bodytype: item?.bodytype,
                powertraintype: item?.powertraintype,
                transmission: item?.transmission,
                drivetrain: item?.drivetrain,
                range: item?.range,
                power: item?.power,
                acceleration: item?.acceleration,
                fastcharging: item?.fastcharging,
                homecharging: item?.homecharging,
                seats: item?.seats,
              }
              optionArray = [...optionArray, options]
          })
         
          console.log(optionArray, "optionArray")
          if(data?.options?.length !== 0){
            setSubCategory([...optionArray])
          }
        })
        .catch((error) => {});
    }
  }, [id]);

  return (
    <div className=" grid grid-cols-1  lg:grid-cols-5">
      <Sidebar />
      <div className="w-full relative lg:col-span-4 mt-32 pb-5 bg-white  lg:mt-0">
        <h1 className="text-center mt-32 text-2xl text-blk-tx font-bold">
          Create Product
        </h1>
        <div className="flex w-full items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
            className="lg:w-1/2"
          >
            <p className=" mt-3 font-bold">Name</p>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="  w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />

            <p className="  mt-3 font-bold">Make</p>
            <input
              required
              value={make}
              onChange={(e) => setMake(e.target.value.toLowerCase())}
              type="text"
              className="  w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />
            <p className=" mt-3 font-bold">Model</p>
            <input
              required
              value={model}
              onChange={(e) => setModel(e.target.value.toLowerCase())}
              type="text"
              className="  w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />
            <p className=" mt-3 font-bold">Price</p>
            <input
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="  w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />
            <p className=" mt-3 font-bold">Customize</p>
            <input
              required
              value={customize}
              onChange={(e) => setCustomize(e.target.value)}
              type="text"
              className="  w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />
            <p className=" mt-3 font-bold">Delivery</p>
            <input
              required
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              type="text"
              className="  w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />
            <p className=" mt-3 text-xl font-bold">Add Options</p>
            {subCategory.map((item, ind) => (
              <div className="my-2  bg-gray-100 p-3" key={ind}>
                <p className="mt-3">Option name</p>
                <div className="flex items-center gap-2">
                  <input
                    required
                    value={subCategory[ind].name}
                    onChange={(e) => {
                      let tempObj = [...subCategory];
                      tempObj[ind].name = e.target.value.toLowerCase();
                      setSubCategory(tempObj);
                    }}
                    type="text"
                    className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                  />
                  {ind + 1 === subCategory.length && (
                    <button
                      onClick={() => {
                        let tempObj = [...subCategory];
                        tempObj[ind + 1] = {
                          name: "",
                          bodytype: "",
                          powertraintype: "",
                          transmission: "",
                          drivetrain: "",
                          range: "",
                          power: "",
                          acceleration: "",
                          fastcharging: "",
                          homecharging: "",
                          seats: "",
                        };
                        setSubCategory(tempObj);
                      }}
                      className="text-xl bg-green-500 px-2 py-1 text-white rounded-md"
                    >
                      +
                    </button>
                  )}
                </div>
                <p className="mt-3">Body type</p>
                <input
                  required
                  value={subCategory[ind].bodytype}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].bodytype = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Powertrain type</p>
                <input
                  required
                  value={subCategory[ind].powertraintype}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].powertraintype = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Transmission</p>
                <input
                  required
                  value={subCategory[ind].transmission}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].transmission = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Drivetrain</p>
                <input
                  required
                  value={subCategory[ind].drivetrain}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].drivetrain = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Range</p>
                <input
                  required
                  value={subCategory[ind].range}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].range = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Power</p>
                <input
                  required
                  value={subCategory[ind].power}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].power = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Acceleration</p>
                <input
                  required
                  value={subCategory[ind].acceleration}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].acceleration = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Fast charging</p>
                <input
                  required
                  value={subCategory[ind].fastcharging}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].fastcharging = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Home charging</p>
                <input
                  required
                  value={subCategory[ind].homecharging}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].homecharging = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />
                <p className="mt-3">Seats</p>
                <input
                  required
                  value={subCategory[ind].seats}
                  onChange={(e) => {
                    let tempObj = [...subCategory];
                    tempObj[ind].seats = e.target.value.toLowerCase();
                    setSubCategory(tempObj);
                  }}
                  type="text"
                  className=" w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
                />

                <div className="flex items-center mt-2 justify-between">
                  {subCategory.length !== 1 && (
                    <button
                      onClick={() => {
                        let tempObj = [...subCategory];
                        tempObj.splice(ind, 1);
                        setSubCategory(tempObj);
                      }}
                      className="py-1 px-2 bg-red-500 rounded-md text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div
              id="createProductFormImage"
              className="mt-4 flex items-center gap-2"
            >
              {imagesPreview.map((image, index) => (
               <div className="relative">
               {image?.url ?  <img
                  key={index}
                  src={image?.url}
                  className="w-20"
                  alt="Product Preview"
                />
                :
                <img
                  key={index}
                  src={image}
                  className="w-20"
                  alt="Product Preview"
                />
            }
            <div onClick={()=>{
              let demImages = images.filter((item, ind)=> ind !== index)
              setImages([...demImages])
              setImagesPreview([...demImages])
             
            }} className=" absolute -top-1 bg-pr p-1 rounded-full text-white -right-1 z-10">
<VscClose className="w-3 h-3 cursor-pointer"/>
            </div>
               </div>
              ))}
            </div>

            <p className=" mt-3 mb-1">Images</p>
            <input
            
              multiple
              onChange={createProductImagesChange}
              type="file"
            />

            <div className="w-full flex items-center justify-center mt-3">
              <button className="inline-block text-center transition delay-100 ease-linear bg-pr border border-transparent rounded-md py-2 px-8 font-medium text-white hover:bg-blk-txt">
                Submit
              </button>
            </div>
          </form>
        </div>
        {loading && (
          <div
            className="fixed top-0 flex items-center justify-center left-0 w-full h-screen"
            style={{ background: "rgba(255,255,255,0.5)" }}
          >
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <svg
                class="animate-spin -ml-1 mr-3 h-10 w-10 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Please Wait...
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
