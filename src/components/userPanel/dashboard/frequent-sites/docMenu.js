import React, { useState } from 'react';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { API_URL } from '../../../../constant';

const DocMenu = ({ docId, docTitle, menuPosition, isMenuVisible, onEditSuccess, onDeleteSuccess }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [infoData, setInfoData] = useState(null);

  // Edit document name
  const handleEditName = async () => {
    const newName = prompt('Enter new document name:', docTitle);
    if (newName && newName !== docTitle) {
      const formData = new URLSearchParams();
      formData.append('id', docId);
      formData.append('title', newName);
      const response = await fetch(`${API_URL}/document`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (response.ok) {
        const updatedDoc = await response.json();
        onEditSuccess(updatedDoc);
      } else {
        alert('Failed to update document name');
      }
    }
  };

  // Delete document
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    const formData = new URLSearchParams();
    formData.append('id', docId);
    const response = await fetch(`${API_URL}/document`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    if (response.ok) {
      onDeleteSuccess();
    } else {
      alert('Failed to delete document');
    }
  };

  // Show info modal
  const toggleInfo = async () => {
    if (!showInfo) {
      try {
        const response = await fetch(`${API_URL}/document?id=${docId}`);
        if (!response.ok) throw new Error('Failed to fetch document info');
        const data = await response.json();
        setInfoData(data);
      } catch (error) {
        setInfoData(null);
        alert('Error fetching document info: ' + error.message);
      }
    }
    setShowInfo((prev) => !prev);
  };

  const closeInfo = () => setShowInfo(false);

  return (
    <>
      {isMenuVisible && (
        <div
          className="absolute z-10 bg-white shadow-lg rounded-lg p-4"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <ul className="space-y-2">
            <li
              onClick={handleEditName}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <FaEdit className="mr-3 text-gray-500" />
              <span>Edit Name</span>
            </li>
            <li
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <FaTrash className="mr-3 text-gray-500" />
              <span>Delete Document</span>
            </li>
            <li
              onClick={toggleInfo}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <FaInfoCircle className="mr-3 text-gray-500" />
              <span>Info</span>
            </li>
          </ul>
        </div>
      )}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-800">Document Information</h4>
              <button onClick={closeInfo} className="text-gray-500 hover:text-gray-700">
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
                    <span className="font-medium text-gray-600">Modified at:</span>
                    <span className="text-gray-800">{new Date(infoData.modified_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">History:</span>
                    <span className="text-gray-800">
                      {infoData.history && infoData.history.length
                        ? infoData.history.map((h, i) => (
                            <div key={i}>{new Date(h).toLocaleString()}</div>
                          ))
                        : 'No history'}
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

export default DocMenu;
