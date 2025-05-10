import React, { useState, useEffect } from 'react';

const CATEGORY_OPTIONS = [
  { id: '1', name: 'IT' },
  { id: '2', name: 'BA' },
  { id: '3', name: 'EE' },
  { id: '4', name: 'EN' },
];

const ModalCategory = ({ isOpen, onClose, onSave, initialCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || CATEGORY_OPTIONS[0].id);

  useEffect(() => {
    setSelectedCategory(initialCategory || CATEGORY_OPTIONS[0].id);
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-30">
      <div className="bg-white mt-24 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onSave(selectedCategory)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCategory;
