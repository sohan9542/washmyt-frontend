import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { URI } from "../App";
import { toast } from "react-toastify";
const RetailerSearch = () => {
  const [zipCode, setZipCode] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const [makecategory, setMakecategory] = useState([]);
  const [modelcategory, setModelcategory] = useState([]);
  useEffect(() => {
    var config = {
      method: "get",
      url: `${URI}/api/v1/category`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
    };
    axios(config)
      .then(function (response) {
        setMakecategory(response.data?.make);
        setModelcategory(response.data?.model);
        // setAllProducts(response.data?.retailer);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const [retailers, setRetailers] = useState(null);
  const search = () => {
    if (zipCode === "" && make === "" && model === "") {
      toast.error("Need to select at least 1 filter", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      let data = JSON.stringify({
        zip: zipCode,
        make: make,
        model: model,
      });

      let config = {
        method: "post",
        url: `${URI}/api/v1/retailer/find`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          setRetailers(response.data?.result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const searchwithParams = (makeData, modelData) => {
    let data = JSON.stringify({
      zip: zipCode,
      make: makeData,
      model: modelData,
    });

    let config = {
      method: "post",
      url: `${URI}/api/v1/retailer/find`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setRetailers(response.data?.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const makedata = searchParams.get("make");
  const modeldata = searchParams.get("model");

  useEffect(() => {
    if (makedata !== null) {
      searchwithParams(makedata, "");
      setMake(makedata)
    }

    if (modeldata !== null) {
      searchwithParams("", modeldata);
      setModel(modeldata)
    }
  }, [makedata, modeldata]);

  return (
    <div className=" mt-5 px-3 lg:px-0">
      <div className=" max-w-[1500px] mx-auto">
        <h1 className="text-3xl pb-6 font-medium text-gray-600 ">Get started by searching Retailer</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className=" grid grid-cols-1 lg:grid-cols-7 gap-2 lg:gap-5"
        >
          <div className="lg:col-span-2">
            <p className="text-gray-500 text-sm">Zip Code</p>
            <input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              type="text"
              placeholder="Ex: 33907"
              className="w-full border px-3 py-3 mt-2 bg-transparent outline-none focus:border focus:border-pr"
            />
          </div>
          <div className="lg:col-span-2">
            <p className="text-gray-500 text-sm">Make</p>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full border px-3 py-3 mt-2  text-gray-500 bg-transparent outline-none focus:border focus:border-pr"
              name=""
              id=""
            >
              <option value=""></option>
              {makecategory.map((item, ind) => (
                <option key={ind} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <p className="text-gray-500 text-sm">Model</p>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full border px-3 py-3 mt-2  text-gray-500 bg-transparent outline-none focus:border focus:border-pr"
              name=""
              id=""
            >
              <option value=""></option>
              {modelcategory.map((item, ind) => (
                <option key={ind} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center mt-7 gap-2">
            <button
              type="submit"
              className="px-3 py-3 border flex items-center gap-2 text-pr hover:bg-pr hover:text-white  border-pr "
            >
              <BiSearch className="w-5  h-5  " /> Search
            </button>
          </div>
        </form>
        <div className=" w-full mt-10 grid grid-cols-1 gap-5 lg:grid-cols-4">
          {retailers !== null && (
            <>
              {retailers?.length !== 0 ? (
                <>
                  {retailers.map((item, ind) => (
                    <Link
                      key={ind}
                      to={"/retailer/" + item?._id}
                      className="bg-white shadow-md hover:text-pr p-5 rounded-md"
                    >
                
                      <p className="text-gray-500 ">Linked Car : <span className="font-bold">{item?.car?.length}</span></p>
                      <h1 className="text-xl pt-2 font-bold text-gray-700">
                        {item?.dealerName}
                      </h1>
                
                      <p className="text-gray-500 pt-2">{item?.street}</p>
                      <p className="text-gray-500 pt-1">{item?.address}</p>
                      <button className="px-3 py-3 border  mt-5 w-full text-cener font-bold rounded-md gap-2 text-pr hover:bg-pr hover:text-white  border-pr ">
                        SELECT RETAILER
                      </button>
                    </Link>
                  ))}
                </>
              ) : (
                <p>No Result Found</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetailerSearch;