import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/images/logo.png";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleEditProfile, clearStore } from "../features/user/userSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useSelector((store) => store.user);

  return (
    <Wrapper>
      <header className="nav-center">
        <img src={logo} alt="company-logo" />

        <div className="btn-container">
          <button
            type="button"
            className="btn"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.username}
            <FaCaretDown />
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button
              type="button"
              className="dropdown-btn"
              onClick={() => {
                dispatch(handleEditProfile());
                navigate("/complete-profile");
              }}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="dropdown-btn"
              onClick={() => dispatch(clearStore("Logging out..."))}
              // onClick={() => dispatch(logoutUser())}
            >
              logout
            </button>
          </div>
        </div>
      </header>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.1);
  .btn-container {
    position: relative;
  }
  .nav-center {
    display: flex;
    width: 90vw;
    align-items: center;
    justify-content: space-between;
  }
  img {
    height: 50px;
  }
  .dropdown {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    background: #dbeafe;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 0.5rem;
    text-align: center;
    visibility: hidden;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
  }
  .show-dropdown {
    visibility: visible;
  }
  .btn {
    cursor: pointer;
    background: #3b82f6;
    color: #fff;
    border: transparent;
    border-radius: 0.25rem;
    letter-spacing: 1px;
    padding: 0.375rem 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: 0.3s ease-in-out all;
    text-transform: capitalize;
    display: inline-block;
  }
  .dropdown-btn {
    background: transparent;
    border-color: transparent;
    color: #3b82f6;
    letter-spacing: 1px;
    text-transform: capitalize;
    cursor: pointer;
  }
`;

export default NavBar;
