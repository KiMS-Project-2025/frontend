import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle, FaCog } from 'react-icons/fa';

const DropdownMenu = () => {
  return (
    <div className="absolute top-12 right-0 w-6128 bg-white shadow-lg rounded-lg py-4 px-2">
      {/* Header */}
      <div className="flex items-center gap-4 px-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
          TP 
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">THAI THANH PHAT</div>
          <div className="text-sm text-gray-500">ITITIU21274@student.hcmiu.edu.vn</div>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* Menu Items */}
      <div className="space-y-2">
        <Link
          to="/user/profile"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
        >
          <FaUserCircle className="text-gray-600" /> View account
        </Link>
        <Link
          to="/user/setting"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
        >
          <FaCog className="text-gray-600" /> Settings
        </Link>
        <Link
          to="/user/logout"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
        >
          <FaSignOutAlt className="text-gray-600" /> Sign out
        </Link>
      </div>
    </div>
  );
};

export default DropdownMenu;