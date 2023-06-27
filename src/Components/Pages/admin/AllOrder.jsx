import axios from "axios";
import React, { useContext, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiFillDelete,
  AiOutlineCloseCircle,
  AiOutlineEye,
} from "react-icons/ai";
import { GoNote } from "react-icons/go";
import { BiNetworkChart } from "react-icons/bi";

import { URI } from "../../../App";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

const AllOrder = () => {
  const [allProducts, setAllProducts] = useState([]);

  const [reload, setReload] = useState(false);

  //   fetching all orders
  React.useEffect(() => {
    var config = {
      method: "get",
      url: `${URI}/api/v1/admin/orders`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
    };
    axios(config)
      .then(function (response) {
        setAllProducts(response.data?.orders?.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });

    if (reload) {
      setReload(false);
    }
  }, [reload]);

  const deleteOrder = (id) => {
    var config = {
      method: "delete",
      url: `${URI}/api/v1/admin/order/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setReload(true);
          toast.success("Delete Successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Something went Wrong!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const [showDetails, setShowDetails] = useState(false);
  const [orderSelected, setOrderSelected] = useState(null);

  const updateorder = (id, status) => {
    let data = JSON.stringify({
      status: status,
    });
    var config = {
      method: "put",
      url: `${URI}/api/v1/admin/order/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          setReload(true);
          setShowDetails(false);
          toast.success("Update Successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch(function (error) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  const [open, setOpen] = useState(false);
  const [addId, setAddId] = useState("");
  const [note, setNote] = useState("");
  const addnote = () => {
    let data = JSON.stringify({
      newNote: note,
    });
    var config = {
      method: "put",
      url: `${URI}/api/v1/admin/order/${addId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          setReload(true);
          setShowDetails(false);
          setOpen(false);
          toast.success("Update Successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch(function (error) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  return (
    <div>
      <div className=" grid grid-cols-1 lg:grid-cols-5">
        <Sidebar />
        {showDetails === false ? (
          <div className=" mt-3 py-3 px-2 rounded-xl lg:col-span-4 bg-white shadow-sm">
            <h2 className=" font-semibold text-3xl text-gray-700 text-center mt-20">
              All Orders
            </h2>
            <div>
              <div className=" w-full    mt-4 overflow-x-scroll lg:overflow-hidden ">
                <table className="min-w-full ">
                  <thead className="bg-blue-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Name
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Retailer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Price
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Transaction
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-2 text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {allProducts.length != 0 && (
                    <tbody className="bg-white  text-sm">
                      {allProducts?.map((item, ind) => (
                        <tr>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.shippingInfo?.name}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.orderItem?.product?.name}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.orderItem?.retailer?.dealerName}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>${item?.itemsPrice}</p>
                          </td>

                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.paymentInfo?.id}</p>
                          </td>

                          <td className="px-4 py-2 text-gray-600 font-medium  whitespace-nowrap">
                            <div className=" flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setShowDetails(true);
                                  setOrderSelected(item);
                                }}
                                className=" px-2 hover:bg-red-600 hover:text-white py-1 border-2 border-red-600 text-red-600 rounded-md text-sm"
                              >
                                <AiOutlineEye className=" w-5 h-5 cursor-pointer" />
                              </button>

                              <button
                                onClick={() => {
                                  deleteOrder(item?._id);
                                }}
                                className=" px-2 hover:bg-red-600 hover:text-white py-1 border-2 border-red-600 text-red-600 rounded-md text-sm"
                              >
                                <AiFillDelete className=" w-5 h-5 cursor-pointer" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ViewOrder
              order={orderSelected}
              updateorder={updateorder}
              setShowDetails={setShowDetails}
            />
          </>
        )}
      </div>
    </div>
  );
};

const ViewOrder = ({ order, updateorder, setShowDetails }) => {
  return (
    <div className="lg:col-span-4">
      <h2 className=" font-semibold text-3xl text-gray-700 text-center mt-20">
        Order Details
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className=" mt-4 border p-10">
          <h1 className="text-xl font-bold text-pr">Order Info</h1>
          <p className="text-lg">
            <span className="font-bold">Address: </span>{" "}
            {order?.shippingInfo?.street}
          </p>
          <p className="text-lg">
            <span className="font-bold">City: </span>{" "}
            {order?.shippingInfo?.city}
          </p>
          <p className="text-lg">
            <span className="font-bold">Country: </span>{" "}
            {Country.getCountryByCode(order?.shippingInfo?.country).name}
          </p>
          <p className="text-lg">
            <span className="font-bold">Phone: </span>{" "}
            {order?.shippingInfo?.phone}
          </p>
          <p className="text-lg">
            <span className="font-bold">State: </span>{" "}
            {
              State.getStateByCodeAndCountry(
                order?.shippingInfo?.state,
                order?.shippingInfo?.country
              ).name
            }
          </p>

          <p className="text-lg">
            <span className="font-bold"> Price: </span> ${order?.itemsPrice}
          </p>
        </div>
        <div className=" mt-4 border p-10 ">
          <h1 className="text-xl font-bold text-pr">Product Info</h1>
          <p className="text-lg">
            <span className="font-bold">Product Name: </span>{" "}
            {order?.orderItem?.product?.name}
          </p>
          <p className="text-lg">
            <span className="font-bold">Make: </span>{" "}
            {order?.orderItem?.product?.make}
          </p>
          <p className="text-lg">
            <span className="font-bold">Model: </span>{" "}
            {order?.orderItem?.product?.model}
          </p>

          <h1 className="text-xl font-bold text-pr mt-4">Retailer Info</h1>
          <p className="text-lg">
            <span className="font-bold">Product Name: </span>{" "}
            {order?.orderItem?.retailer?.dealerName}
          </p>
          <p className="text-lg">
            <span className="font-bold">Address: </span>{" "}
            {order?.orderItem?.retailer?.address}
          </p>
          <p className="text-lg">
            <span className="font-bold">Street: </span>{" "}
            {order?.orderItem?.retailer?.street}
          </p>
     
        </div>
      </div>
      <div className=" flex items-center flex-wrap mt-10 w-full justify-center gap-2">
        <button
          onClick={() => setShowDetails(false)}
          className=" px-2 flex items-center gap-2 cursor-pointer hover:bg-red-600 hover:text-white py-1 border-2 border-red-600 text-red-600 rounded-md text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AllOrder;
