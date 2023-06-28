import { Fragment, useContext } from "react";
import { RapperContent } from "../../../App";
import { Routes, Route, Navigate } from "react-router-dom";
import AllProduct from "../admin/Allproducts";
import CreateProduct from "../admin/CreateProduct";
import Retailer from "../admin/Retailer";
import AddRetailer from "../admin/AddRetailer";
import AllOrder from "../admin/AllOrder";
import RetailerUpdate from "../admin/RetailerUpdate";

const ProtectedRoute = ({ go }) => {
  const { isAuthenticated, loading } = useContext(RapperContent);
  const routeConfig = () => {
    if (go === "/admin/products") {
      return <AllProduct />;
    }
    else if(go === "/admin/create"){
      return <CreateProduct/>
    }
    else if(go === "/admin/retailer"){
      return <Retailer/>
    }
    else if(go === "/admin/retailer/create"){
      return <AddRetailer/>
    }
    else if(go === "/admin/orders"){
      return <AllOrder/>
    }
    else if(go === "/admin/retailer/:id"){
      return <RetailerUpdate/>
    }
  };
  return (
    <>
      {!loading ? (
        <>
          {isAuthenticated ? routeConfig() : <Navigate to="/login" replace />}
        </>
      ) : (
        <p>Checking the routes</p>
      )}
    </>
  );
};

export default ProtectedRoute;
