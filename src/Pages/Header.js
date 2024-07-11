import React from "react";
import Logout from "../component/userAuth/Logout";
import { useSelector } from "react-redux";

const Header = ({ handleShow }) => {
  // const email = localStorage.getItem("email");
  const email = useSelector((state) => state.auth.email);

  return (
    <header>
      <div className="d-lg-none border py-1 fixed-top bg-light d-flex justify-content-between align-items-center">
        <span className="px-2 py-2">
          <i
            onClick={handleShow}
            style={{ cursor: "pointer" }}
            className="bi bi-three-dots-vertical fs-2 mt-1 ps-2"
          ></i>
          <i className="bi fs-2 text-dark ps-2 bi-envelope">
            {" "}
            <span className="fs-10 fw-bold">Mail Express</span>
          </i>{" "}
        </span>
        <span className="text-end pe-2">
          {/* <p className="mb-0 ">Logged in as:</p> */}
          <p className="mb-0 text-dark fw-bold">{email} | <Logout /></p>
        </span>
      </div>
    </header>
  );
};

export default Header;
