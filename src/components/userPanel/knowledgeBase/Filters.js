import React, { useState } from 'react';

const CATEGORY_OPTIONS = [
  { id: '1', name: 'IT' },
  { id: '2', name: 'BA' },
  { id: '3', name: 'EE' },
  { id: '4', name: 'EN' },
];

const Filters = ({ handleSearch }) => {
  // State để quản lý bộ lọc
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

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
          <option value="all">All Categories</option>
          {CATEGORY_OPTIONS.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <label className="mr-2">Sort by Date</label>
        <select
          className="p-2 border border-gray-300 rounded-lg"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Nút Search */}
      <button
        onClick={handleSearchClick}
        className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default Filters;