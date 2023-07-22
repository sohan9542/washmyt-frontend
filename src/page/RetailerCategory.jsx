import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { URI } from "../App";

const RetailerCategory = () => {
  const [retailers, setRetailers] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    let config = {
      method: "get",
      url: `${URI}/api/v1/retailer/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setRetailers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="mt-5 min-h-[850px]">
      <div className=" max-w-[1500px] px-10 mx-auto">
        <h1 className=" text-4xl font-bold">
          {retailers?.retailer?.dealerName}
        </h1>
        <div className=" w-full mt-10 grid grid-cols-1 gap-5 lg:grid-cols-4">
          <>
            {retailers?.products?.length !== 0 ? (
              <>
                {retailers?.products?.map((item, ind) => (
                  <Link
                    key={ind}
                    to={
                      "/retailer/" + retailers?.retailer?._id + "/" + item?._id
                    }
                    className="bg-white shadow-md hover:text-pr p-5 rounded-md"
                  >
                   <img src={item?.images?.[0]?.url} alt="" />
                    <div className="flex items-center justify-between mt-5">
                      <p className="text-gray-500 ">Make : {item?.make}</p>
                      <p className="text-gray-500 ">Model : {item?.model}</p>
                    </div>
                    <h1 className="text-xl font-bold text-gray-700">
                      {item?.name}
                    </h1>

                    <button className="px-3 py-3 border  mt-5 w-full text-cener font-bold rounded-md gap-2 text-black hover:bg-black hover:text-white  border-black ">
                     Order Now
                    </button>
              
                  </Link>
                ))}
              </>
            ) : (
              <p>No Result Found</p>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default RetailerCategory;
