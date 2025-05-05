import React from 'react';

const FileMenu = ({ docId, onEdit, onDelete, onDownload, isMenuVisible, menuPosition, onClose  }) => {
  return (
    isMenuVisible && (
      <div
        className="absolute bg-white shadow-md rounded-lg p-3 w-48 z-10 file-menu"
        style={{
          top: `${menuPosition?.top + 15}px`,  // Dịch chuyển menu xuống dưới nút 3 chấm
          left: `${menuPosition?.left}px`,     // Căn chỉnh menu theo nút ba chấm
        }}
        onMouseLeave={onClose}
      >
        <div className="text-sm text-gray-700">
          <button
            onClick={() => onEdit(docId)}
            className="block w-full text-left py-1 px-2 hover:bg-gray-100 rounded-md"
          >
            Edit Name
          </button>
          <button
            onClick={() => onDelete(docId)}
            className="block w-full text-left py-1 px-2 hover:bg-gray-100 rounded-md text-red-500"
          >
            Delete
          </button>
          <button
            onClick={() => onDownload(docId)}
            className="block w-full text-left py-1 px-2 hover:bg-gray-100 rounded-md"
          >
            Download
          </button>
        </div>
      </div>
    )
  );
};

export default FileMenu;