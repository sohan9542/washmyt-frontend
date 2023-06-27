import React from "react";
import { Link, NavLink } from "react-router-dom";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { HiOutlineMenu } from "react-icons/hi";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Sidebar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:min-h-screen">
      <button
        type="button"
        className="bg-white p-2 rounded-md text-black ml-6 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <HiOutlineMenu className="h-6 w-6" aria-hidden="true" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <p></p>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col pl-7">
                          <Link
                            className="hover:text-new text-lg pb-2 font-medium"
                            to="/admin/products"
                          >
                            Cars
                          </Link>

                          <Link
                            className="hover:text-new pt-2 text-lg pb-2  font-medium"
                            to="/admin/orders"
                          >
                            Orders
                          </Link>
                          <Link
                            className="hover:text-new pt-2 text-lg pb-2  font-medium"
                            to="/admin/retailer"
                          >
                            Retailers
                          </Link>
                          <p
                            onClick={() => {
                              localStorage.removeItem("Etoken");
                              window.location.href = "/";
                            }}
                            className="hover:text-new cursor-pointer pt-2 text-lg pb-2  font-medium"
                          >
                            Log Out
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className=" flex-col hidden lg:flex h-full px-10 py-6 pt-20 divide-y bg-card-bg">
        <Link
          className="hover:text-new text-lg pb-2 font-medium"
          to="/admin/products"
        >
          Cars
        </Link>
        <Link
          className="hover:text-new pt-2 text-lg pb-2  font-medium"
          to="/admin/orders"
        >
          Orders
        </Link>
        <Link
          className="hover:text-new pt-2 text-lg pb-2  font-medium"
          to="/admin/retailer"
        >
          Retailers
        </Link>
        <p
          onClick={() => {
            localStorage.removeItem("Etoken");
            window.location.href = "/";
          }}
          className="hover:text-new cursor-pointer  pt-2  pb-2  font-medium"
        >
          Log Out
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
