import React, { useState } from 'react';

const FileMenu = ({ docId, isMenuVisible, menuPosition, onEdit, onDelete, onDownload, fileData }) => {
    const [showInfo, setShowInfo] = useState(false);  // Trạng thái hiển thị thông tin

    // Hàm mở/đóng phần hiển thị thông tin
    const toggleInfo = () => {
        setShowInfo((prev) => !prev);
    };

    // Hàm đóng modal thông tin
    const closeInfo = () => {
        setShowInfo(false);
    };
    return (
        <>
            {/* Menu */}
            {isMenuVisible && (
                <div
                    className="file-menu absolute z-10 bg-white shadow-lg rounded-lg p-4"
                    style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                    }}
                >
                    <ul className="space-y-2">
                        <li onClick={() => onEdit(docId)} className="text-gray-600 cursor-pointer">
                            Edit Name
                        </li>
                        <li onClick={() => onDelete(docId)} className="text-gray-600 cursor-pointer">
                            Delete
                        </li>
                        <li onClick={() => onDownload(fileData)} className="text-gray-600 cursor-pointer">
                            Download
                        </li>
                        <li
                            onClick={toggleInfo}
                            className="text-gray-600 cursor-pointer"
                        >
                            Info
                        </li>
                    </ul>
                </div>
            )}
            {showInfo && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xl font-semibold text-gray-800">File Information</h4>
                            <button onClick={closeInfo} className="text-gray-500 text-xl">X</button>
                        </div>
                        <div className="mt-4">
                            <p><strong>Title:</strong> {fileData.title}</p>
                            <p><strong>Content:</strong> {fileData.content}</p>
                            <p><strong>Category:</strong> {fileData.category}</p>
                            <p><strong>Author:</strong> {fileData.author}</p>
                            <p><strong>Uploaded on:</strong> {fileData.uploadDate}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FileMenu;