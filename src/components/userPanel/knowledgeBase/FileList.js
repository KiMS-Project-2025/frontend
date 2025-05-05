import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const FileList = ({ filteredDocuments }) => {
  const [thumbnails, setThumbnails] = useState({});  // State để lưu ảnh thumbnail của các file PDF

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
        const viewport = page.getViewport({ scale: 0.3 });  // Thay đổi kích thước ảnh thumbnail
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

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {filteredDocuments.map((doc) => (
        <div key={doc.id} className="p-4 bg-white shadow-md rounded-lg">
          {/* Hiển thị ảnh thumbnail của PDF nếu có */}
          {thumbnails[doc.id] && (
            <img
              src={thumbnails[doc.id]}
              alt="PDF Thumbnail"
              className="w-full h-32 object-cover mb-4 rounded-lg"
            />
          )}
          <h3 className="text-xl font-semibold text-gray-800">{doc.title}</h3>
          <p className="text-gray-600">{doc.shortDescription}</p>
          <p className="text-gray-400 text-sm">Uploaded on: {doc.uploadDate}</p>
        </div>
      ))}
    </div>
  );
};

export default FileList;