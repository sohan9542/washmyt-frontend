import React from "react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import axios from "axios";
import { URI } from "../../../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
const AddRetailer = () => {
  const [name, setName] = useState("");
  const history = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [allProductCopy, setAllProductCopy] = useState([]);
  const [street, setStreet] = useState("");
  const [address, setAddress] = useState("");
  const [carId, setCarId] = useState([]);
  const [make, setMake] = useState([]);
  const [model, setModel] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [testDrive, setTestDrive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const create = () => {
    setLoading(true)
    let data = JSON.stringify({
      images: images,
      dealerName: name,
      street: street,
      address: address,
      car: carId,
      make: make,
      model: model,
      zip: zipCode,
      testDrive: testDrive,
    });

    let config = {
      method: "post",
      url: `${URI}/api/v1/admin/retailer/new`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setLoading(false)
        if (response.data?.success) {
          toast.success("Retailer Created Successfully", {
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
            history("/admin/retailer");
          }, 2500);
        }
      })
      .catch((error) => {
        setLoading(false)
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

  React.useEffect(() => {
    var config = {
      method: "get",
      url: `${URI}/api/v1/admin/products`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
    };
    axios(config)
      .then(function (response) {
        setAllProducts(response.data?.products?.reverse());
        setAllProductCopy(response.data?.products?.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const [selectedCars, setSelectedCars] = useState([]);
  React.useEffect(() => {}, [carId]);

  React.useEffect(() => {
    selectedCars.map((item) => {
      let makeFilter = make.filter((i) => i === item?.make);
      if (makeFilter.length === 0) {
        setMake([...make, item?.make]);
      }
      let modelFilter = model.filter((i) => i === item?.model);
      if (modelFilter.length === 0) {
        setModel([...model, item?.model]);
      }
    });
  }, [selectedCars]);

  const addSelectedCar = (item) => {
    setCarId([...carId, item]);
    let demoCar = allProducts.find((e) => e._id === item);
    setSelectedCars([...selectedCars, demoCar]);
    let removedList = allProductCopy.filter((i) => i._id !== item);
    setAllProductCopy([...removedList]);
  };

  const removeSelectedCar = (selected) => {
    let removedCarList = selectedCars.filter(
      (item) => item?._id !== selected?._id
    );
    let dMake = [];
    let dModel = [];
    removedCarList.map((item) => {
      dMake = [...dMake, item?.make];
      dModel = [...dModel, item?.model];
    });
    setMake([...dMake]);
    setModel([...dModel]);
    setSelectedCars([...removedCarList]);

    let dcarId = carId.filter((item) => item !== selected?._id);
    setCarId([...dcarId]);

    let removedList = allProducts.filter((item) => item?._id === selected?._id);
    setAllProductCopy([...allProductCopy, removedList[0]]);
  };


  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });

    console.log(files)
  };
  return (
    <div className=" grid relative grid-cols-1 lg:grid-cols-5">
      <Sidebar />
      <div className="w-full lg:col-span-4 bg-white mt-32 lg:mt-0">
        <h1 className="text-center mt-32 text-2xl text-blk-tx font-bold">
          Create Retailer
        </h1>
        <div className="flex w-full items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
            className="w-full lg:w-96"
          >
             <div
              id="createProductFormImage"
              className="mt-4 flex items-center gap-2"
            >
              {imagesPreview.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  className="w-20"
                  alt="Product Preview"
                />
              ))}
            </div>
            <p className=" mt-3 mb-1">Logo</p>
            <input
              required
              onChange={createProductImagesChange}
              type="file"
            />

            <p className=" mt-3">Name</p>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className=" lg:w-96 w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />
            <p className=" mt-3">Street</p>
            <input
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              type="text"
              className=" lg:w-96 w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />
            <p className=" mt-3">Address </p>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              className=" lg:w-96 w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />

            <p className=" mt-3">Zip Code </p>
            <input
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              type="text"
              className=" lg:w-96 w-full rounded-md border outline-none bg-none px-2 py-2 text-sm"
            />

            <div className="flex items-center mt-4 lg:w-96 w-full gap-2 flex-wrap">
              {selectedCars.map((item) => (
                <p
                  onClick={() => removeSelectedCar(item)}
                  className="bg-pr px-2 py-1 text-xs text-white font-medium rounded-md flex items-center gap-1"
                >
                  {item?.name} <IoClose className="w-4 h-5" />
                </p>
              ))}
            </div>

            <p className=" mt-3">Link A Car</p>
            <select
              required={selectedCars.length > 0 ? false : true}
              value={carId}
              onChange={(e) => {
                addSelectedCar(e.target.value);
                // console.log(product)
              }}
              name=""
              id=""
              className=" lg:w-96 w-full mt-1 rounded-md border outline-none bg-none px-2 py-2 text-sm"
            >
              <option value=""></option>
              {allProductCopy.map((item, ind) => (
                <option key={ind} value={item?._id}>
                  {item?.name}
                </option>
              ))}
            </select>

            <p className=" mt-3"> Chance for Test Drive</p>
            <label class="relative inline-flex mt-2 items-center cursor-pointer">
              <input  onChange={(e)=>setTestDrive(e.target.checked)}  type="checkbox"  class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span class="ml-3  font-medium text-gray-900">{testDrive ? "Yes": "No"}</span>
            </label>

            <div className="w-full flex items-center justify-center mt-7">
              <button className="inline-block text-center transition delay-100 ease-linear bg-pr border border-transparent rounded-md py-2 px-8 font-medium text-white ">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading &&  <div
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
        </div>}
    </div>
  );
};

export default AddRetailer;
