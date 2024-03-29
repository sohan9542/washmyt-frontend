import React from "react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import axios from "axios";
import { URI } from "../../../App";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import {VscClose} from "react-icons/vsc"
const RetailerUpdate = () => {
  const { id } = useParams();
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
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const create = () => {
    let data = JSON.stringify({
      dealerName: name,
      street: street,
      images: images,
      address: address,
      car: carId,
      make: make,
      model: model,
      zip: zipCode,
      testDrive: testDrive,
    });

    let config = {
      method: "put",
      url: `${URI}/api/v1/admin/retailer/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data?.success) {
          toast.success("Retailer Updated Successfully", {
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

  React.useEffect(() => {
    if (allProducts.length !== 0) {
      var config = {
        method: "get",
        url: `${URI}/api/v1/retailer/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
        },
      };
      axios(config)
        .then(function (response) {
          let data = response.data?.retailer;
          setName(data?.dealerName);
          setStreet(data?.street);
          setAddress(data?.address);
          setImages(data?.images);
          setImagesPreview(data?.images);
          setTestDrive(data?.testDrive)
          data?.car?.map((item) => {
            addSelectedCar(item);
          });

          setMake([...data?.make]);
          setModel([...data?.model]);
          setZipCode(data?.zip);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [allProducts]);

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
    let removedList;
    if (allProductCopy.length !== 0) {
      removedList = allProductCopy.filter((i) => i._id !== item);
    }
    else{
      removedList = allProducts.filter((i) => i._id !== item);
    }
    // console.log("removedList", removedList)
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
          setImagesPreview([...imagesPreview,  reader.result]);
          setImages([...images, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-5">
      <Sidebar />
      <div className="w-full lg:col-span-4 bg-white mt-32 lg:mt-0">
        <h1 className="text-center mt-32 text-2xl text-blk-tx font-bold">
          Update Retailer
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
              <input checked={testDrive} onChange={(e)=>setTestDrive(e.target.checked)}  type="checkbox"  class="sr-only peer" />
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
    </div>
  );
};

export default RetailerUpdate;
