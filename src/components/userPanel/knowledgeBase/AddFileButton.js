import React from 'react';
import { FaPlus } from 'react-icons/fa';

const AddFiletButton = ({ handleAddFile }) => {
  return (
    <button
      onClick={handleAddFile}
      className="p-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
    >
      <FaPlus /> Add a New File
    </button>
  );
};

export default AddFiletButton;