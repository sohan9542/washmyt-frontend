import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { URI } from "../App";
import { toast } from "react-toastify";
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];
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
        // setAllProducts(response.data?.retailer);
      })
      .catch(function (error) {
        console.log(error);
      });
   
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: `${URI}/api/v1/category/model?make=${make}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
    };
    axios(config)
      .then(function (response) {
        setModelcategory(response.data?.model);
        // setAllProducts(response.data?.retailer);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [make])
  

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



  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });


  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (isLoaded && !loadError) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        { types: ['(regions)'], componentRestrictions: { country: 'us' } }
      );

      autocomplete.setFields(['address_components']);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.address_components) {
          const postalCodeComponent = place.address_components.find(
            component => component.types.includes('postal_code')
          );
          const postalCode = postalCodeComponent ? postalCodeComponent.long_name : '';

          setZipCode(postalCode);
        }
      });
    }
  }, [isLoaded, loadError]);

  const handleZipCodeInputChange = (e) => {
    setZipCode(e.target.value);

  };


  return (
    <div className=" mt-5 px-3 lg:px-0 min-h-[900px]">
      <div className="px-7  mx-auto">
        <h1 className="text-3xl pb-6 font-medium text-gray-600 ">Search, Research & Order Your Next Car</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className={` grid grid-cols-1 ${modelcategory.length !== 0 ? "lg:grid-cols-10": "lg:grid-cols-7"} gap-2 lg:gap-5`}
        >
          <div className="lg:col-span-3">
            <p className="text-gray-500 text-sm">Zip Code</p>
            <input
         ref={autocompleteRef}
         id="zip_code_input"
         value={zipCode}
         onChange={handleZipCodeInputChange}
              type="text"
              placeholder="Ex: 33907"
              className="w-full border px-3 py-3 mt-2 bg-transparent outline-none focus:border focus:border-pr"
            />
            
          </div>
          <div className="lg:col-span-3">
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
         {modelcategory.length > 0 && <div className="lg:col-span-3">
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
          </div>}
          <div className="flex items-center mt-7 gap-2">
            <button
              type="submit"
              className="px-3 py-3 border flex w-full justify-center items-center gap-2 text-pr hover:bg-pr hover:text-white  border-pr "
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
