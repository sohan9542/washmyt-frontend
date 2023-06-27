import React, { createContext, useRef, useState } from "react";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Components/Pages/auth/ProtectedRoute";
import RetailerSearch from "./page/RetailerSearch";
import Topbar from "./layout/Topbar";
import Login from "./page/Login";
import RetailerDetails from "./page/RetailerDetails";
import RetailerCategory from "./page/RetailerCategory";

export const RapperContent = createContext();
export const URI = process.env.REACT_APP_API_URI;
export const headerToken = {
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("Etoken")}`,
  },
};
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // checking users authorization
  React.useEffect(() => {
    const etoken = localStorage.getItem("Etoken");
    if (etoken) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);
  return (
    <RapperContent.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loading
      }}
    >
      <BrowserRouter>
        <div className="bg-gray-50 min-h-screen">
          <Topbar />
          <ToastContainer />
          {/* Other components */}
          <Routes>
            <Route index path="/" element={<RetailerSearch />} />
            <Route path="/retailer/:id" element={<RetailerCategory />} />
            <Route path="/retailer/:id/:pid" element={<RetailerDetails />} />
            <Route path="/login" element={<Login />} />
        
            <Route
              path="/admin/products"
              element={<ProtectedRoute go="/admin/products"/>} />
        
            <Route
              path="/admin/create"
              element={<ProtectedRoute go="/admin/create" />}
            />
            <Route
              path="/admin/retailer"
              element={<ProtectedRoute go="/admin/retailer" />}
            />
            <Route
              path="/admin/retailer/create"
              element={<ProtectedRoute go="/admin/retailer/create" />}
            />
            <Route
              path="/admin/orders"
              element={<ProtectedRoute go="/admin/orders" />}
            />
         
          </Routes>
        </div>
      </BrowserRouter>
    </RapperContent.Provider>
  );
};

export default App;
