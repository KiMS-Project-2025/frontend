import React, { useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import DropdownMenu from './DropdownMenu'; // Import DropdownMenu
import ModalSearch from './ModalSearch';

const Header = ({ toggleDropdown, dropdownOpen, onFileSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="sticky top-0 flex justify-between items-center mb-5 bg-custom-blue p-3 shadow-md">
      {/* Left: Dashboard title */}
      <div className="text-left">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Center: Search bar */}
      <div className="relative w-1/3 flex justify-center">
        <div className="flex items-center w-full bg-gray-100 p-2 rounded-lg">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for documents..."
            onFocus={() => setModalOpen(true)}
            className="w-full bg-transparent border-none focus:outline-none text-gray-700"
            readOnly // Make it open modal on click/focus
          />
        </div>
        <ModalSearch
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={onFileSelect}
        />
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