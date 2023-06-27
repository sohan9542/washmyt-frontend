import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiSearch } from "react-icons/bi";
import { RapperContent, URI } from "../App";
import axios from "axios";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
// const [first, setfirst] = useState(second)

const Topbar = () => {
const {isAuthenticated }= useContext(RapperContent)
  return (
    <div className=" pr-3 flex items-center justify-between py-4 bg-gray-50">
      <Link to="/">
        <img className="h-12 w-40" src="/logo.png" alt="" />
      </Link>
   <div className="flex items-center gap-10">
{isAuthenticated &&   <Link className="font-medium  gap-2 " to="/admin/products">
    
    Admin
    </Link>}
    <Link className="font-medium flex items-center gap-2 " to="/">
      <BiSearch className=" h-5 w-5 " />
    <span className="hidden lg:block">  Find Retailer</span>
    </Link>
   </div>
    </div>
  );
};

export default Topbar;
