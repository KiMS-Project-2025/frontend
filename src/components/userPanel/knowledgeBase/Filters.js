import React, { useState } from 'react';

const Filters = ({ handleSearch }) => {
  // State để quản lý bộ lọc
  const [category, setCategory] = useState('All Categories');
  const [sortOrder, setSortOrder] = useState('Newest First');

  // Hàm xử lý thay đổi bộ lọc
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Hàm xử lý nhấn nút Search
  const handleSearchClick = () => {
    // Gọi hàm handleSearch với các bộ lọc hiện tại
    handleSearch(category, sortOrder);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center">
        <label className="mr-2">Filter by Category</label>
        <select
          className="p-2 border border-gray-300 rounded-lg"
          value={category}
          onChange={handleCategoryChange}
        >
          <option>All Categories</option>
          <option>Category 1</option>
          <option>Category 2</option>
        </select>
      </div>
      <div className="flex items-center">
        <label className="mr-2">Sort by Date</label>
        <select
          className="p-2 border border-gray-300 rounded-lg"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {/* Nút Search */}
      <button
        onClick={handleSearchClick}
        className="ml-4 p-2 bg-blue-600 text-white rounded-lg"
      >
        Search
      </button>
    </div>
  );
};

export default Filters;