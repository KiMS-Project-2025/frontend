import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <div className="mt-4 flex justify-between">
      <input
        type="text"
        placeholder="Search by title, tag, or content"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 rounded-lg border border-gray-300"
      />
      <button
        onClick={handleSearch}
        className="ml-4 p-2 bg-blue-600 text-white rounded-lg"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;