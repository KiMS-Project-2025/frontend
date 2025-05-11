import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaDownload, FaInfoCircle } from 'react-icons/fa';
import { API_URL } from '../../../constant';

const FileMenu = ({
  docId,
  isMenuVisible,
  menuPosition,
  onEdit,
  onDelete,
  onDownload,
  onEditDescription,
  onEditCategory,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [infoData, setInfoData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/category`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleInfo = async () => {
    if (!showInfo) {
      try {
        const response = await fetch(`${API_URL}/file?id=${docId}&detail=1`);
        if (!response.ok) throw new Error('Failed to fetch file info');
        const data = await response.json();
        setInfoData(data);
      } catch (error) {
        setInfoData(null);
        alert('Error fetching file info: ' + error.message);
      }
    }
    setShowInfo((prev) => !prev);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(opt => opt.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (!isMenuVisible || !menuPosition) return null;

  return (
    <>
      <div
        className="file-menu absolute z-10 bg-white shadow-lg rounded-lg p-4"
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
          minWidth: '200px'
        }}
      >
        <ul className="space-y-2">
          <li
            onClick={(e) => {
              e.stopPropagation();
              onEdit(docId);
            }}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <FaEdit className="mr-3 text-gray-500" />
            <span>Edit Name</span>
          </li>
          <li
            onClick={(e) => {
              e.stopPropagation();
              onEditDescription(docId);
            }}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <FaEdit className="mr-3 text-gray-500" />
            <span>Edit Description</span>
          </li>
          <li
            onClick={(e) => {
              e.stopPropagation();
              onEditCategory(docId);
            }}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <FaEdit className="mr-3 text-gray-500" />
            <span>Edit Category</span>
          </li>
          <li
            onClick={(e) => {
              e.stopPropagation();
              onDelete(docId);
            }}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <FaTrash className="mr-3 text-gray-500" />
            <span>Delete</span>
          </li>
          <li
            onClick={(e) => {
              e.stopPropagation();
              onDownload(docId);
            }}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <FaDownload className="mr-3 text-gray-500" />
            <span>Download</span>
          </li>
          <li
            onClick={(e) => {
              e.stopPropagation();
              toggleInfo();
            }}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <FaInfoCircle className="mr-3 text-gray-500" />
            <span>Info</span>
          </li>
        </ul>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-800">File Information</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {infoData ? (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Title:</span>
                    <span className="text-gray-800">{infoData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Description:</span>
                    <span className="text-gray-800">{infoData.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="text-gray-800">{getCategoryName(infoData.cid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Author:</span>
                    <span className="text-gray-800">{infoData.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Modified at:</span>
                    <span className="text-gray-800">
                      {new Date(infoData.modified_at).toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileMenu;