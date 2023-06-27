import React, { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

import { Navigation } from "swiper";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { URI } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Country, State } from "country-state-city";
const RetailerDetails = () => {
  const { id, pid } = useParams();
  const [confirmPayment, setConfirmPayment] = useState(1);

  const [retailerInfo, setRetailerInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  useEffect(() => {
    if (id) {
      var config = {
        method: "get",
        url: `${URI}/api/v1/retailer/${id}/${pid}`,
      };
      axios(config)
        .then(function (response) {
          setRetailerInfo(response.data?.retailer);
          setProductInfo(response.data?.product);
          // setAllProducts(response.data?.retailer);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [id]);

  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    apt: "",
    state: "",
    zip: "",
    country: "",
  });
  const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");
  console.log("stripePromise", stripePromise);
  return (
    <div className=" mt-5">
      <div className=" max-w-[1500px] mx-auto">
        <div className=" grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className=" lg:col-span-3 h-[1000px] bg-white ">
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
            >
              {productInfo?.images?.map((item, ind) => (
                <SwiperSlide key={ind}>
                  <img src={item?.url} alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className=" lg:col-span-2 min-h-[1000px]  p-16 bg-white w-full">
            <h1 className=" text-4xl font-bold">
              Reserve your{" "}
              <span className=" uppercase">{productInfo?.model}</span>
            </h1>
            {confirmPayment === 1 && (
              <>
                <p className="pt-3  text-sm">
                  Delivery with{" "}
                  <span className="font-bold">{retailerInfo?.dealerName}</span>
                </p>
                <p className="pt-5 font-bold">
                  Available in {productInfo?.options?.length} options
                </p>
                <div>
                  {productInfo?.options?.map((item, ind) => (
                    <ExpandableOption key={ind} title={item?.name}>
                      <ul className="mt-4">
                        <li>
                          <div className="flex items-center justify-between">
                            <p>Body type</p>
                            <p className="uppercase">{item?.bodytype}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Powertrain type</p>
                            <p className="capitalize">{item?.powertraintype}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Transmission</p>
                            <p className="capitalize">{item?.transmission}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Drivetrain</p>
                            <p className="uppercase">{item?.drivetrain}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Range</p>
                            <p className="capitalize">{item?.range}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Power</p>
                            <p>{item?.power}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Acceleration</p>
                            <p>{item?.acceleration}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Fast charging</p>
                            <p>{item?.fastcharging}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Home charging</p>
                            <p>{item?.homecharging}</p>
                          </div>
                        </li>
                        <li>
                          <div className="flex mt-2 items-center justify-between">
                            <p>Seats</p>
                            <p>{item?.seats}</p>
                          </div>
                        </li>
                      </ul>
                    </ExpandableOption>
                  ))}
                </div>
                <h1 className="mt-9 font-bold text-xl">Key dates</h1>
                <div className="mt-3 flex items-center justify-between">
                  <p>Customize</p>
                  <p>{productInfo?.customize}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p>Delivery</p>
                  <p>{productInfo?.delivery}</p>
                </div>
                <h1 className="mt-9 font-bold text-xl">Pricing</h1>
                <div className="mt-3 flex items-center justify-between">
                  <p>Refundable deposit</p>
                  <p className="font-bold">${productInfo?.price}</p>
                </div>
                <div className="mt-8 flex items-start gap-2 cursor-pointer ">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="terms" className=" text-base cursor-pointer">
                    I accept the Terms and Conditions and{" "}
                    <span className="border-b-2 font-bold">
                      Online Reservation Privacy Notice
                    </span>
                  </label>
                </div>
                <div
                  onClick={() => setConfirmPayment(2)}
                  className="bg-pr py-4 font-semibold text-white cursor-pointer hover:bg-black mt-10 rounded-md text-center"
                >
                  CONTINUE TO PAYMENT
                </div>
              </>
            )}
            {confirmPayment === 2 && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <p>Refundable deposit</p>
                  <p className="font-bold">${productInfo?.price}</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setConfirmPayment(3);
                  }}
                >
                  <h1 className="mt-6 font-bold pb-5 text-xl">Your details</h1>
                  <input
                    required
                    value={paymentDetails.name}
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.name = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                    type="text"
                    placeholder="Full Name"
                    className="w-full border px-3 py-3 bg-transparent outline-none  focus:border focus:border-pr"
                  />

                  <input
                    required
                    value={paymentDetails.email}
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.email = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                    type="email"
                    placeholder="Email Address"
                    className="w-full border px-3 py-3 mt-3 bg-transparent outline-none focus:border focus:border-pr"
                  />
                  <input
                    required
                    value={paymentDetails.phone}
                    type="text"
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.phone = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                    placeholder="+1"
                    className="w-full border px-3 py-3 mt-3 bg-transparent outline-none focus:border focus:border-pr"
                  />
                  <h1 className="mt-6 font-bold pb-5 text-xl">Your address</h1>
                  <input
                    required
                    value={paymentDetails.street}
                    type="text"
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.street = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                    placeholder="Street Address"
                    className="w-full border px-3 py-3 bg-transparent outline-none  focus:border focus:border-pr"
                  />
                  <input
                    value={paymentDetails.apt}
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.apt = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                    type="text"
                    placeholder="Apt, unit, # (optional)"
                    className="w-full border px-3 py-3 mt-3 bg-transparent outline-none  focus:border focus:border-pr"
                  />
                  <input
                    required
                    type="text"
                    value={paymentDetails.city}
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.city = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                    placeholder="City"
                    className="w-full border px-3 py-3 mt-3 bg-transparent outline-none  focus:border focus:border-pr"
                  />

                  <input
                    required
                    type="text"
                    value={paymentDetails.zip}
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.zip = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                    placeholder="Zip code"
                    className="w-full border px-3 py-3 mt-3 bg-transparent outline-none  focus:border focus:border-pr"
                  />
                  <select
                    required
                    className="w-full border px-3 py-3 mt-3 text-gray-500 text-sm bg-transparent outline-none  focus:border focus:border-pr"
                    value={paymentDetails.country}
                    onChange={(e) => {
                      let demo = paymentDetails;
                      demo.country = e.target.value;
                      setPaymentDetails({ ...demo });
                    }}
                  >
                    <option value="">Country</option>
                    {Country &&
                      Country.getAllCountries().map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  {paymentDetails.country !== "" && (
                    <div>
                      <select
                        className="w-full border px-3 py-3 mt-3 text-gray-500 text-sm bg-transparent outline-none  focus:border focus:border-pr"
                        required
                        value={paymentDetails.state}
                        onChange={(e) => {
                          let demo = paymentDetails;
                          demo.state = e.target.value;
                          setPaymentDetails({ ...demo });
                        }}
                      >
                        <option value="">State</option>
                        {State &&
                          State.getStatesOfCountry(paymentDetails.country).map(
                            (item) => (
                              <option key={item.isoCode} value={item.isoCode}>
                                {item.name}
                              </option>
                            )
                          )}
                      </select>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer mt-3 justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pr hover:bg-new"
                  >
                    Next
                  </button>
                </form>
              </>
            )}
            {confirmPayment === 3 && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <p>Refundable deposit</p>
                  <p className="font-bold">${productInfo?.price}</p>
                </div>
                <h1 className="mt-6 font-bold pb-5 text-xl"> Card details</h1>
                <Elements stripe={stripePromise}>
                  <PaymentElement
                    paymentDetails={paymentDetails}
                    productInfo={productInfo}
                    retailerInfo={retailerInfo}
                    setConfirmPayment={setConfirmPayment}
                  />
                </Elements>
              </>
            )}
            {confirmPayment === 4 && (
              <div className="h-96 w-full flex items-center justify-center flex-col ">
                <AiOutlineCheckCircle className="w-10 h-10 text-green-500" />

                <h1 className="text-lg font-semibold mt-2">
                  Your Order has been Placed successfully{" "}
                </h1>
                <Link className="text-pr mt-4" to="/">
                  Back to home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentElement = ({
  paymentDetails,
  productInfo,
  retailerInfo,
  setConfirmPayment,
}) => {
  const payBtn = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  const paymentData = {
    amount: Math.round(productInfo.price * 100),
  };

  //   order define
  const order = {
    shippingInfo: paymentDetails,
    itemsPrice: productInfo.price,
    orderItem: {
      product: productInfo,
      retailer: retailerInfo,
    },
  };

  // createing the order
  const createOrder = async (order) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
        },
      };
      const { data } = await axios.post(
        `${URI}/api/v1/order/new`,
        order,
        config
      );
      sessionStorage.removeItem("disXcount");
      console.log("orderData", data);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
        },
      };
      const { data } = await axios.post(
        `${URI}/api/v1/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: paymentDetails.name,
            email: paymentDetails.email,
            address: {
              line1: paymentDetails.street,
              city: paymentDetails.city,
              state: paymentDetails.state,
              postal_code: paymentDetails.zip,
              country: paymentDetails.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;

        toast.error(result.error.message, {
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
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          createOrder(order);
          setConfirmPayment(4);
          // history.push("/success");
        } else {
          toast.error("There's some issue while processing payment", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;

      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <form onSubmit={(e) => submitHandler(e)}>
      <div>
        <CardNumberElement className="w-full border px-3 py-3 mt-3 bg-transparent outline-none  focus:border focus:border-pr" />
      </div>
      <div>
        <CardExpiryElement className="w-full border px-3 py-3 mt-3 bg-transparent outline-none  focus:border focus:border-pr" />
      </div>
      <div>
        <CardCvcElement className="w-full border px-3 py-3 mt-3 bg-transparent outline-none  focus:border focus:border-pr" />
      </div>

      <input
        type="submit"
        value={`Pay - $500`}
        ref={payBtn}
        className="flex w-full cursor-pointer mt-3 justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pr hover:bg-new"
      />
    </form>
  );
};

const ExpandableOption = ({ title, children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="border rounded px-4 py-3 mt-3">
      <div
        className={`flex items-center cursor-pointer justify-between transition-colors `}
        onClick={toggleExpand}
      >
        <span className="mr-2 capitalize">{title}</span>
        {expanded ? (
          <MdOutlineKeyboardArrowUp className="w-6 h-6" />
        ) : (
          <MdOutlineKeyboardArrowDown className="w-6 h-6" />
        )}
      </div>
      <div
        className={` transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-0 opacity-0" : "max-h-full opacity-100"
        }`}
        style={{ maxHeight: expanded ? "0" : "1000px" }}
      >
        {children}
      </div>
    </div>
  );
};

export default RetailerDetails;
