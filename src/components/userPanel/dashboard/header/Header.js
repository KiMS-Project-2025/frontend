import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import DropdownMenu from './DropdownMenu'; // Import DropdownMenu
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleDropdown, dropdownOpen }) => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <header className="sticky top-0 flex justify-between items-center mb-5 bg-custom-blue p-3 shadow-md">
      {/* Left: Dashboard title */}
      <div className="text-left">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Center: Search bar */}
      <div className="relative w-1/3 flex justify-center">
        <div 
          className="flex items-center w-full bg-gray-100 p-2 rounded-lg cursor-pointer"
          onClick={handleSearchClick}
        >
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for documents..."
            className="w-full bg-transparent border-none focus:outline-none text-gray-700 cursor-pointer"
            readOnly
          />
        </div>
      </div>

      {/* Right: User icon and dropdown menu */}
      <nav className="flex items-center relative">
        <button onClick={toggleDropdown} className="focus:outline-none">
          <FaUserCircle className="text-3xl text-gray-600 hover:text-blue-600" />
        </button>
        
        {/* Render DropdownMenu */}
        {dropdownOpen && <DropdownMenu />}
      </nav>
    </header>
  );
};

export default Header;