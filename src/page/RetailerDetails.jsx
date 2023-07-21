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
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const RetailerDetails = () => {
  const { id, pid } = useParams();
  const [confirmPayment, setConfirmPayment] = useState(1);

  const [retailerInfo, setRetailerInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const cancelButtonRef = useRef(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [timeNeeded, setTimeNeeded] = useState(false);
  const [dateSelect, setDateSelect] = useState("");
  const [timeSelect, setTimeSelect] = useState("");

  const testDriveRrq = async () => {
    let data = JSON.stringify({
      firstName,
      lastName,
      email,
      phone,
      zipCode,
      dateSelect,
      timeSelect,
      retailerId: retailerInfo?._id,
      productId: productInfo?._id

    });

    let config = {
      method: "post",
      url: `${URI}/api/v1/testdrive`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data?.success) {
          toast.success("Test Drive Request Successfull", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setOpen(false);
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
  const stripePromise = loadStripe(
    "pk_live_51NMK0uEjZbT4OKZlj5P9rS51fEsmDuwNQB8ydFbMZL6pSua1Vkh14Yu73z23OEyLw7ZgIUetI6qZ7L7QwWwW1HD600cL8GySw3"
  );
  // console.log("stripePromise", stripePromise);

  const [accept, setAccept] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <div className=" mt-5">
      <PrivacyModal open={open} setOpen={setOpen} />
      <TestDrive
        open={open2}
        setOpen={setOpen2}
        cancelButtonRef={cancelButtonRef}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
        setPhone={setPhone}
        setZipCode={setZipCode}
        timeNeeded={timeNeeded}
        setTimeNeeded={setTimeNeeded}
        setDateSelect={setDateSelect}
        setTimeSelect={setTimeSelect}
        testDriveRrq={testDriveRrq}
      />
      <div className=" max-w-[1500px] mx-auto">
        <div className=" grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
          <div className=" lg:col-span-3 mt-32   ">
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
          <div className=" lg:col-span-2 min-h-[900px] p-3  lg:p-16 bg-white w-full">
            <h1 className=" text-4xl font-bold">
            Order your <span>{productInfo?.name}</span>
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
                  <p>Refundable deposit (due today)</p>
                  <p className="font-bold">${productInfo?.price}</p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setConfirmPayment(2);
                  }}
                >
                  <div className="mt-8 flex items-start gap-2 cursor-pointer ">
                    <input
                      required
                      onChange={(e) => setAccept(e.target.checked)}
                      type="checkbox"
                      name="terms"
                      id="terms"
                      className="w-5 h-5 mt-1"
                    />
                    <p className=" text-base cursor-pointer">
                      I accept the Terms and Conditions and{" "}
                      <span
                        onClick={() => setOpen(true)}
                        className="border-b-2 font-bold"
                      >
                        Online Reservation Privacy Notice
                      </span>
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full uppercase py-4 font-semibold text-white cursor-pointer bg-black mt-10 rounded-md text-center"
                  >
                    Order with Card
                  </button>
                  {retailerInfo?.testDrive && (
                    <div
                      onClick={() => setOpen2(true)}
                      className="px-3 text-center cursor-pointer py-3 border  mt-2 uppercase w-full text-cener font-bold rounded-md gap-2 text-[#0094ff]  border-[#0094ff] "
                    >
                      Request A Test Drive
                    </div>
                  )}
                </form>
              </>
            )}
            {confirmPayment === 2 && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <p>Refundable deposit (due today)</p>
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
                  <p>Refundable deposit (due today)</p>
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

function PrivacyModal({ open, setOpen }) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-5xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        CarOrder.co Online Order Terms & Conditions | Updated
                        June 2023
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          This page sets out the terms and conditions (“Terms”)
                          under which you are able (subject to availability) to
                          make an online order (“Order”) for a new car. Please
                          note that these Terms only apply to the Order and do
                          not apply to the purchase or lease of a new car from
                          the CarOrder.co retailer you choose (“Retailer”). The
                          terms on which you purchase or lease a car from a
                          Retailer will be set out in a separate contract to be
                          entered into between you and the Retailer at a later
                          date.
                          <br />
                          By ticking the box below confirming your acceptance of
                          these Terms, you agree to be bound by them. If you do
                          not accept these Terms, you will not be able to make
                          the Order for the car. You should print a copy of
                          these Terms or save them to your computer for future
                          reference.
                          <br />
                          <br />
                          <span className="font-bold">
                            1. INFORMATION ABOUT US
                          </span>
                          <br />
                          We operate the website www.carorder.co. We are
                          CarOrder Co., a company with our principal place of
                          business in the USA.
                          <br />
                          <br />
                          <span className="font-bold">
                            2. ELIGIBILITY AND START DATE
                          </span>
                          <br />
                          2.1 The opportunity to order a new car online is only
                          open to US consumers. It is not open to corporate
                          customers or consumers outside of the US.
                          <br />
                          <div className="pt-1" />
                          2.2 Your rights attached to the Order are personal to
                          you and may not be transferred to anyone else.
                          <br />
                          <div className="pt-1" />
                          2.3 You will be able to order a new car online until
                          we remove this option from our website.
                          <br />
                          <br />
                          <span className="font-bold">
                            3. HOW TO MAKE AN ONLINE ORDER FOR A NEW CAR
                          </span>
                          <br />
                          3.1 You can make an Order by:
                          <br />
                          <div className="pt-1" />
                          (a) completing the online process; and <br />
                          <div className="pt-1" />
                          (b) paying a refundable $50-$500 deposit at the time
                          of the Order (“Deposit”) - depending on what deposit
                          is required for that specific vehicle. 3.2 Our online
                          process will guide you through the steps you need to
                          take. That process allows you to check and amend any
                          errors before making the Order. Please take the time
                          to read and check your Order at each page of the
                          process. 3.3 After you make your Order, we will send
                          you an email acknowledging that we have received your
                          Order and confirming that it has been accepted (“Order
                          Confirmation”). Each Order Confirmation will have its
                          own, unique order number.
                          <br />
                          <div className="pt-1" />
                          3.4 If you do not receive the Order Confirmation
                          within 24 hours of completing the online process,
                          please contact our Customer Care Center.
                          <br />
                          <br />
                          <span className="font-bold">4. THE DEPOSIT</span>
                          <br />
                          <div className="pt-1" />
                          4.1 Your Deposit is collected by the Retailer you
                          select. <br />
                          <div className="pt-1" />
                          4.2 The Deposit is payable by credit card and Wallet.
                          We use STRIPE for internet payment services. You agree
                          to STRIPE handling the payment transaction, your card
                          details and any other information necessary for such
                          payment transaction to be executed by STRIPE
                          (including but not limited to fraud prevention).
                          STRIPE is certified by banks and card acquirers to
                          securely manage payment transactions. All
                          communication between our website and your bank is
                          handled by STRIPE and encrypted via Secure Sockets
                          Layer (“SSL”).
                          <br />
                          <div className="pt-1" />
                          4.3 You are responsible for verifying that the payment
                          transaction has been successfully completed. The Order
                          will only be processed after the payment transaction
                          for the Deposit is completed.
                          <br />
                          <div className="pt-1" />
                          4.4 The Deposit is refundable if you decide (before
                          taking delivery) not to proceed with the purchase or
                          lease of your new car.
                          <br />
                          <br />
                          <span className="font-bold">
                            5. COMPLETING THE PURCHASE OR LEASE OF YOUR NEW CAR
                          </span>
                          5.1 After submitting your Deposit you will receive an
                          email with your order details. If you wish to discuss
                          pricing or financing options you can contact your
                          selected Retailer.
                          <br />
                          <div className="pt-1" />
                          5.2 When further pricing and options become available
                          for this car you will be notified to build and submit
                          your custom order.
                          <br />
                          <div className="pt-1" />
                          5.3 We will let you know when your new car is
                          available for delivery (“Available Delivery Date”).
                          <br />
                          <div className="pt-1" />
                          5.4 To complete the purchase or lease of your new car,
                          you will need to enter into a contract with the
                          Retailer on or before delivery. The contract will
                          record all the terms of the purchase or lease
                          including final price, payment terms, delivery, and
                          warranty between you and the Retailer.
                          <br />
                          <div className="pt-1" />
                          5.5 If you do not take delivery of your new car within
                          2 weeks of the Available Delivery Date:
                          <br />
                          <div className="pt-1" />
                          (a) your Order will lapse; and
                          <br />
                          <div className="pt-1" />
                          (b) the Deposit will be refunded to you.
                          <br />
                          <br />
                          <span className=" font-bold">
                            6. CUSTOMER SERVICE
                          </span>
                          <br />
                          If you wish to contact us for any reason, you can do
                          so by emailing our Customer Care Center.
                          <br />
                          <br />
                          <div className="pt-1"></div>
                          <span className="font-bold">
                            {" "}
                            7. OUR RIGHT TO CHANGE THESE TERMS
                          </span>
                          <br />
                          <div className="pt-1"></div>
                          7.1 We may revise these Terms as they apply to the
                          Order from time to time to reflect changes in relevant
                          laws and regulatory requirements.
                          <br />
                          <div className="pt-1"></div>
                          7.2 If we have to revise these Terms as they apply to
                          your Order, we will contact you to give you reasonable
                          advance notice of the changes and let you know how to
                          cancel the Order.
                          <br />
                          <br />
                          <span className="font-bold">
                            {" "}
                            8. YOUR RIGHTS TO CANCEL YOUR ORDER AND RECEIVE A
                            REFUND
                          </span>
                          <br />
                          <div className="pt-1"></div>
                          8.1 You may cancel your Order at any time before you
                          take delivery of your new car. This means that during
                          that period if you decide for any reason that you do
                          not want to proceed with the Order, you can notify
                          your Retailer of your decision to cancel the Order and
                          receive a refund of your Deposit. Your Retailer is
                          able to assist with refunds of your Deposit if you (i)
                          choose to cancel your Order or (ii) you do not take
                          delivery of your car within two weeks of the Available
                          Delivery Date.
                          <br />
                          <div className="pt-1"></div>
                          8.2 If you cancel your Order, your Deposit will be
                          refunded.
                          <br />
                          <br />
                          <span className="font-bold">
                            {" "}
                            9. EVENTS OUTSIDE OUR CONTROL
                          </span>
                          9.1 We will not be liable or responsible for any
                          failure to perform, or delay in performance of, any of
                          our obligations under these Terms that is caused by an
                          Event Outside Our Control. An “Event Outside Our
                          Control” is any act or event beyond our reasonable
                          control.
                          <br />
                          <div className="pt-1"></div>
                          9.2 If an Event Outside Our Control takes place that
                          affects the performance of our obligations under these
                          Terms:
                          <br />
                          <div className="pt-1"></div>
                          (a) we will contact you as soon as reasonably possible
                          to notify you; and
                          <br />
                          <div className="pt-1"></div>
                          (b) our obligations will be suspended and the time for
                          performance of our obligations will be extended for
                          the duration of the Event Outside Our Control.
                          <br />
                          <div className="pt-1"></div>
                          9.3 You may cancel the Order if it is affected by an
                          Event Outside Our Control. To cancel please contact
                          your Retailer and they will refund the Deposit.
                          <br />
                          <br />
                          <span className="font-bold">
                            10. HOW WE USE YOUR PERSONAL INFORMATION
                          </span>
                          <br />
                          10.1 We are responsible for the personal data
                          processed in connection with the Order. All processing
                          will take place in accordance with applicable
                          legislation concerning processing of personal data as
                          well as our Privacy Notice.
                          <br />
                          <div className="pt-1"></div>
                          10.2 You acknowledge that your personal data is
                          processed not only by us but also by authorized
                          Retailers. Your personal data will only be processed
                          and shared as explained in our Online Order Privacy
                          Notice.
                          <br />
                          <br />
                          <span className="font-bold">11. USE OF OUR SITE</span>
                          <br />
                          Your use of our website is also governed by the other
                          terms and conditions on the site including “Privacy”,
                          “Legal” and “Cookies”. Please take the time to read
                          these, as they include important terms which apply to
                          you.
                          <br />
                          <br />
                          <span className="font-bold"> 12. COMMUNICATION</span>
                          <br />
                          If we have to contact you or give you notice in
                          writing, we will do so by phone, email or by pre-paid
                          post to the address you provide to us during the Order
                          process.
                          <br />
                          <div className="pt-1"></div>
                          <span className="font-bold">
                            13. OTHER IMPORTANT TERMS
                          </span>
                          <br />
                          <div className="pt-1"></div>
                          13.1 We may transfer our rights and obligations to
                          another organization, but this will not affect your
                          rights or our obligations under these Terms. We will
                          always notify you in writing or by posting on this
                          webpage if this happens.
                          <br />
                          <div className="pt-1"></div>
                          13.2 Each of the paragraphs of these Terms operates
                          separately. If any court or relevant authority decides
                          that any of them are unlawful or unenforceable, the
                          remaining paragraphs will remain in full force and
                          effect.
                          <br />
                          <div className="pt-1"></div>
                          13.3 If we fail to insist that you perform any of your
                          obligations under these Terms, or if we do not enforce
                          our rights against you, or if we delay in doing so,
                          that will not mean that we have waived our rights
                          against you and will not mean that you do not have to
                          comply with those obligations. If we do waive a
                          default by you, we will only do so in writing, and
                          that will not mean that we will automatically waive
                          any later default by you.
                          <br />
                          <div className="pt-1"></div>
                          13.4 You confirm that you are not a person on any
                          sanctions list imposed by the UN, EU, United Kingdom
                          or US or acting on behalf of a person designated on
                          any such list, and that you will not sell, provide or
                          transfer any car product to any such sanctioned
                          person, or to any person located in a country or
                          territory which is, or whose government is, the
                          subject of comprehensive sanctions. If at any time
                          this turns out not to be true, your Order and all
                          orders made and all agreements concluded or that have
                          not yet been finally executed may be terminated with
                          immediate effect, without any liability to compensate
                          you whatsoever. Furthermore, according to law we may
                          not be able to repay any payments that you may have
                          made to us.
                          <br />
                          <div className="pt-1"></div>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function TestDrive({
  open,
  setOpen,
  cancelButtonRef,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  setZipCode,
  timeNeeded,
  setTimeNeeded,
  setDateSelect,
  setTimeSelect,
  testDriveRrq
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full lg:max-w-3xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mt-3 ml-4 ">
                      <Dialog.Title
                        as="h3"
                        className="text-3xl font-bold leading-6 text-gray-900"
                      >
                        TEST DRIVE
                      </Dialog.Title>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          testDriveRrq();
                        }}
                        className="mt-8 w-full"
                      >
                        <input
                          type="text"
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full border p-3 outline-none  rounded-md"
                          required
                          placeholder="First Name *"
                        />
                        <input
                          type="text"
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full border p-3 mt-3 outline-none  rounded-md"
                          required
                          placeholder="Last Name *"
                        />

                        <input
                          type="text"
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border p-3 mt-3 outline-none  rounded-md"
                          required
                          placeholder="Email Address*"
                        />
                        <input
                          type="text"
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border p-3 mt-3 outline-none  rounded-md"
                          required
                          placeholder="Phone Number*"
                        />
                        <input
                          type="text"
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full border p-3 mt-3 outline-none  rounded-md"
                          required
                          placeholder="Zip Code*"
                        />

                        <legend className="text-sm font-semibold leading-6 text-gray-900">
                          Select a preferred time and date?
                        </legend>

                        <label class="relative inline-flex mt-2 items-center cursor-pointer">
                          <input
                            checked={timeNeeded}
                            onChange={(e) => setTimeNeeded(e.target.checked)}
                            type="checkbox"
                            class="sr-only peer"
                          />
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          <span class="ml-3  font-medium text-gray-900">
                            {timeNeeded ? "Yes" : "No"}
                          </span>
                        </label>

                        {timeNeeded && (
                          <div
                            className="grid
                         grid-cols-1 lg:grid-cols-2 gap-4"
                          >
                            <input
                              onChange={(e) => setDateSelect(e.target.value)}
                              type="date"
                              className="w-full border p-3 mt-3 outline-none  rounded-md"
                              required
                            />
                            <select
                              onChange={(e) => setTimeSelect(e.target.value)}
                              required
                              className="w-full border p-3 mt-3 outline-none  rounded-md"
                              name=""
                              id=""
                            >
                              <option value="">Select time</option>
                              <option value="Anytime">Anytime</option>
                              <option value="Morning">Morning</option>
                              <option value="Afternoon">Afternoon</option>
                              <option value="Evening">Evening</option>
                            </select>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="px-3 mt-4 text-center cursor-pointer py-3 border  uppercase w-full text-cener font-bold rounded-md gap-2 text-pr hover:bg-black hover:text-white  border-pr "
                        >
                          Request A Test Drive
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
           
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default RetailerDetails;
