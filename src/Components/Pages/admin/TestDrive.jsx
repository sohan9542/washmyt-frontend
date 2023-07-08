import axios from "axios";
import React, { useContext, useState } from "react";
import {

  AiFillDelete,

  AiOutlineEye,
} from "react-icons/ai";

import { BiNetworkChart } from "react-icons/bi";

import { URI } from "../../../App";
import Sidebar from "./Sidebar";

import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";

const AllTestDrive = () => {
  const [allProducts, setAllProducts] = useState([]);

  const [reload, setReload] = useState(false);

  //   fetching all orders
  React.useEffect(() => {
    var config = {
      method: "get",
      url: `${URI}/api/v1/admin/testdrive`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
    };
    axios(config)
      .then(function (response) {
        setAllProducts(response.data?.testdata?.reverse());
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
      url: `${URI}/api/v1/admin/testdrive/${id}`,
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



  return (
    <div>
      <div className=" grid grid-cols-1 lg:grid-cols-5">
        <Sidebar />
        <div className=" mt-3 py-3 px-2 rounded-xl lg:col-span-4 bg-white shadow-sm">
            <h2 className=" font-semibold text-3xl text-gray-700 text-center mt-20">
              All Test Drive Requests
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
                        FirstName
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        LastName
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Phone
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                      >
                        Zip
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
                        Retailer Address
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
                            <p>{item?.userData?.firstName}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.userData?.lastName}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.userData?.email}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.userData?.phone}</p>
                          </td>

                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.userData?.zipCode}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.product?.name}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.retailer?.dealerName}</p>
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                            <p>{item?.retailer?.address}</p>
                          </td>

                          <td className="px-4 py-2 text-gray-600 font-medium  whitespace-nowrap">
                            <div className=" flex items-center gap-2">
                           

                              <button
                                onClick={() => {
                                  deleteOrder(item?.userData?._id);
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
      </div>
    </div>
  );
};


export default AllTestDrive;
