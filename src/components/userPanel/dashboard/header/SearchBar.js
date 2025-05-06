import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div className="w-full flex items-center bg-gray-100 p-2 rounded-lg">
      <FaSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search for documents..."
        className="w-full bg-transparent border-none focus:outline-none text-gray-700"
      />
    </div>
  );
};

export default SearchBar;