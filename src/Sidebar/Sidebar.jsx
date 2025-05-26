import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars, FaHome, FaUser, FaTasks,
  FaFile, FaClock, FaSignOutAlt
} from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar">
          <div className="sidebar-title">
            <h2>Tamizha</h2>
          </div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className="sidebar-link" onClick={closeSidebar}>
                <FaHome className="icon" />
                <span className="menu-text">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/clickup" className="sidebar-link" onClick={closeSidebar}>
                <FaTasks className="icon" />
                <span className="menu-text">Click up</span>
              </Link>
            </li>
            <li>
              <Link to="/trackabi" className="sidebar-link" onClick={closeSidebar}>
                <FaClock className="icon" />
                <span className="menu-text">Trackabi</span>
              </Link>
            </li>
            <li>
              <Link to="/workdone" className="sidebar-link" onClick={closeSidebar}>
                <FaFile className="icon" />
                <span className="menu-text">Workdone</span>
              </Link>
            </li>
            <li>
              <Link to="/dailyattendance" className="sidebar-link" onClick={closeSidebar}>
                <RiCheckboxCircleFill className="icon" />
                <span className="menu-text">Attendance</span>
              </Link>
            </li>
            <li>
              <Link to="/employeelist" className="sidebar-link" onClick={closeSidebar}>
                <FaUser className="icon" />
                <span className="menu-text">Employees</span>
              </Link>
            </li>
            <li className="logout-item">
              <Link to="/logout" className="sidebar-link" onClick={closeSidebar}>
                <FaSignOutAlt className="icon" />
                <span className="menu-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
