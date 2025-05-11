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
  onInfo,
  onClose
}) => {
  const [menuStyle, setMenuStyle] = useState({});

  const menuRef = useClickOutside(() => {
    if (onClose) {
      onClose();
    }
  });

  useEffect(() => {
    if (menuPosition && isMenuVisible) {
      const menuWidth = 192; // Width of the menu (w-48 = 12rem = 192px)
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate if menu would overflow right
      const wouldOverflowRight = menuPosition.left + menuWidth > windowWidth;
      
      // Calculate if menu would overflow bottom
      const menuHeight = 120; // Approximate height of menu
      const wouldOverflowBottom = menuPosition.top + menuHeight > windowHeight + window.scrollY;
      
      setMenuStyle({
        position: 'fixed',
        top: wouldOverflowBottom 
          ? `${menuPosition.top - menuHeight}px` 
          : `${menuPosition.top}px`,
        left: wouldOverflowRight 
          ? `${menuPosition.left - menuWidth}px` 
          : `${menuPosition.left}px`,
        zIndex: 50
      });
    }
  }, [menuPosition, isMenuVisible]);

  if (!isMenuVisible) return null;

  const menuItems = [
    { icon: <FaEdit className="w-4 h-4" />, text: "Edit Name", onClick: onEdit },
    { icon: <FaEdit className="w-4 h-4" />, text: "Edit Description", onClick: onEditDescription },
    { icon: <FaTag className="w-4 h-4" />, text: "Change Category", onClick: onEditCategory },
    { icon: <FaDownload className="w-4 h-4" />, text: "Download", onClick: onDownload },
    { icon: <FaInfoCircle className="w-4 h-4" />, text: "Info", onClick: onInfo },
    { icon: <FaTrash className="w-4 h-4" />, text: "Delete", onClick: onDelete, isDanger: true }
  ];

  return (
    <div
      ref={menuRef}
      className="w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
      style={menuStyle}
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
  );
};

export default FileMenu;