import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FaEllipsisV, FaFilePdf } from 'react-icons/fa';
import FileMenu from './FileMenu';  // Import component menu ba chấm

const FileList = ({ filteredDocuments, setFilteredDocuments }) => {
  const [thumbnails, setThumbnails] = useState({});  // State để lưu ảnh thumbnail của các file PDF
  const [activeMenu, setActiveMenu] = useState(null);  // State để quản lý menu ba chấm
  const [menuPosition, setMenuPosition] = useState(null); // State để lưu vị trí của menu


  // Hàm để tạo ảnh thumbnail từ file PDF
  const generateThumbnail = (pdfFile, id) => {
    // Kiểm tra loại file có phải là một Blob hợp lệ không
    if (!(pdfFile instanceof Blob)) {
      console.error('File is not a Blob', pdfFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const pdfData = new Uint8Array(e.target.result);
      try {
        const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
        const page = await pdfDoc.getPage(1);  // Lấy trang đầu tiên
        const viewport = page.getViewport({ scale: 0.5 });  // Thay đổi kích thước ảnh thumbnail
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        const imgUrl = canvas.toDataURL();  // Chuyển thành URL hình ảnh
        setThumbnails((prevThumbnails) => ({
          ...prevThumbnails,
          [id]: imgUrl,
        }));
      } catch (error) {
        console.error('Error generating thumbnail:', error);
      }
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  // Khi danh sách tài liệu thay đổi, tạo ảnh thumbnail cho các file PDF
  useEffect(() => {
    filteredDocuments.forEach((doc) => {
      if (doc.ownFile && !thumbnails[doc.id] && doc.file instanceof Blob) {
        const file = doc.file;  // File PDF được lưu trong object tài liệu
        generateThumbnail(file, doc.id);
      }
    });
  }, [filteredDocuments, thumbnails]);

  // Hàm hiển thị menu khi click vào ba chấm
  const toggleMenu = (e, id) => {
    const rect = e.target.getBoundingClientRect(); // Lấy vị trí của nút ba chấm
    setMenuPosition({
      top: rect.bottom,  // Vị trí menu dưới nút ba chấm
      left: rect.left,   // Căn trái menu với nút ba chấm
    });
    setActiveMenu(activeMenu === id ? null : id); // Toggle menu của mỗi file
  };

  // Hàm xử lý sửa tên file
  const handleEditName = (id) => {
    const newName = prompt('Enter new name:');  // Sửa tên bằng prompt
    if (newName) {
      setFilteredDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, title: newName } : doc
        )
      );
    }
  };

  // Hàm xử lý xóa file
  const handleDeleteFile = (id) => {
    setFilteredDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Hàm xử lý tải xuống file
  const handleDownloadFile = (file) => {
    if (!file) return; // Thêm dòng này
  
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'download.pdf';
    document.body.appendChild(a); // Thêm bước này
    a.click();
    document.body.removeChild(a); // Dọn dẹp
    URL.revokeObjectURL(url);
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredDocuments.map((doc) => (
        <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Header with PDF icon and title */}
          <div className="p-3 flex justify-between items-center">
            <div className="flex items-center">
              <FaFilePdf className="text-red-500 text-lg" />
              <h3 className="ml-2 font-medium text-gray-800">{doc.title || "Untitled Document"}</h3>
            </div>
            <button
              onClick={(e) => toggleMenu(e, doc.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaEllipsisV />
            </button>
          </div>

          {/* PDF thumbnail preview */}
          <div className="h-48 bg-gray-50 flex items-center justify-center">
            {thumbnails[doc.id] ? (
              <img
                src={thumbnails[doc.id]}
                alt="PDF Thumbnail"
                className="w-full h-32 object-cover mb-4 rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <FaFilePdf className="text-gray-300 text-5xl mb-2" />
                <span className="text-xs text-gray-400">Loading preview...</span>
              </div>
            )}
          </div>

          {/* Document title/description and upload date */}
          <div className="p-4">
            <p className="text-sm text-gray-700 font-medium mb-1">
              {doc.shortDescription || doc.title || "Untitled Document"}
            </p>
            <div className="text-xs text-gray-400">
              Uploaded: {doc.uploadDate || "Date not available"}
            </div>
          </div>

          {/* Render Menu for actions */}
          <FileMenu
            docId={doc.id}
            isMenuVisible={activeMenu === doc.id}
            menuPosition={menuPosition}
            onEdit={handleEditName}
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile.bind(null, doc.file)}
          />
        </div>
      ))}
    </div>
  );
};

export default FileList;