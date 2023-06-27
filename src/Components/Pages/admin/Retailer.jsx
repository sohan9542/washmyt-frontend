import axios from "axios";
import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";

import { BiEdit } from "react-icons/bi";
import { URI } from "../../../App";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// import { toast } from "react-toastify";
const Retailer = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [reload, setReload] = useState(false);

  React.useEffect(() => {
    var config = {
      method: "get",
      url: `${URI}/api/v1/admin/retailer`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
      },
    };
    axios(config)
      .then(function (response) {
        setAllProducts(response.data?.retailer);
      })
      .catch(function (error) {
        console.log(error);
      });

    if (reload) {
      setReload(false);
    }
  }, [reload]);

  const deleteCupon = (id) => {
    var config = {
      method: "delete",
      url: `${URI}/api/v1/admin/retailer/${id}`,
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
  return (
    <div>
      <div className=" grid grid-cols-1 lg:grid-cols-5">
        <Sidebar />
        <div className=" mt-3 py-3 px-5 rounded-xl lg:col-span-4 bg-white shadow-sm">
          <div className="flex items-center justify-between  my-5">
            <h2 className=" font-semibold text-3xl text-gray-700 text-center ">
              All Retailers
            </h2>
            <Link
              className="px-3 py-2 border  mt-5  text-cener font-bold rounded-md gap-2 text-pr hover:bg-pr hover:text-white  border-pr "
              to="/admin/retailer/create"
            >
              Add Retailer
            </Link>
          </div>
          <div>
            <div className=" w-full    mt-4 overflow-x-scroll lg:overflow-hidden ">
              <table className="min-w-full ">
                <thead className="bg-blue-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                    >
                      Retailer Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                    >
                      Street
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold text-gray-500  tracking-wider"
                    >
                      Linked Cars
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
                          <p>{item?.retailer?.dealerName}</p>
                        </td>
                        <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                          <p>{item?.retailer?.street}</p>
                        </td>
                        <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">
                          <p>{item?.retailer?.address}</p>
                        </td>
                        <td className="px-4 py-2 text-gray-600 flex items-center gap-1 flex-wrap font-medium ">
                          {item?.retailer?.make?.map((i) => (
                            <p>{i},</p>
                          ))}
                        </td>

                        <td className="px-4 py-2 text-gray-600 font-medium  whitespace-nowrap">
                          <div className=" flex items-center justify-center gap-2">
                            {/* <Link
                              to={"/admin/product/" + item?._id}
                              className=" px-2 hover:bg-red-600 hover:text-white py-1 border-2 border-red-600 text-red-600 rounded-md text-sm"
                            >
                              <BiEdit className=" w-5 h-5 cursor-pointer" />
                            </Link> */}
                            <button
                              onClick={() => {
                                deleteCupon(item?.retailer?._id);
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

export default Retailer;
