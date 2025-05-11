import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaDownload, FaInfoCircle, FaTag } from 'react-icons/fa';
import { API_URL } from '../../../constant';
import useClickOutside from '../../../hooks/useClickOutside';

const FileMenu = ({
  docId,
  isMenuVisible,
  menuPosition,
  onEdit,
  onDelete,
  onDownload,
  onEditDescription,
  onEditCategory,
  onClose
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [infoData, setInfoData] = useState(null);
  const [categories, setCategories] = useState([]);

  const menuRef = useClickOutside(() => {
    if (onClose) {
      setShowInfo(false);
      setInfoData(null);
      onClose();
    }
  });

  useEffect(() => {
    if (!isMenuVisible) {
      setShowInfo(false);
      setInfoData(null);
    }
  }, [isMenuVisible]);

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

  if (!isMenuVisible) return null;

  const menuItems = [
    { icon: <FaEdit className="w-4 h-4" />, text: "Edit Name", onClick: onEdit },
    { icon: <FaEdit className="w-4 h-4" />, text: "Edit Description", onClick: onEditDescription },
    { icon: <FaTag className="w-4 h-4" />, text: "Change Category", onClick: onEditCategory },
    { icon: <FaDownload className="w-4 h-4" />, text: "Download", onClick: onDownload },
    { icon: <FaTrash className="w-4 h-4" />, text: "Delete", onClick: onDelete, isDanger: true }
  ];

  return (
    <>
      <div
        ref={menuRef}
        className="fixed z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
        style={{
          top: menuPosition?.top,
          left: menuPosition?.left,
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              item.isDanger 
                ? 'text-red-600 hover:bg-red-50' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1">{item.text}</span>
          </button>
        ))}
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