import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FaEllipsisV, FaFilePdf } from 'react-icons/fa';
import FileMenu from './FileMenu';  // Import component menu ba chấm
import { API_URL } from '../../../constant';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileList = ({ filteredDocuments, setFilteredDocuments }) => {
  const [thumbnails, setThumbnails] = useState({});  // State để lưu ảnh thumbnail của các file PDF
  const [activeMenu, setActiveMenu] = useState(null);  // State để quản lý menu ba chấm
  const [menuPosition, setMenuPosition] = useState(null); // State để lưu vị trí của menu
  const [loadingThumbnails, setLoadingThumbnails] = useState({});

  // Category options
  const CATEGORY_OPTIONS = [
    { id: '1', name: 'IT' },
    { id: '2', name: 'BA' },
    { id: '3', name: 'EE' },
    { id: '4', name: 'EN' },
  ];

  // Function to generate thumbnail from PDF
  const generateThumbnail = async (pdfFile, id) => {
    if (!pdfFile || loadingThumbnails[id]) return;

    try {
      setLoadingThumbnails(prev => ({ ...prev, [id]: true }));
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      
      const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
      const page = await pdfDoc.getPage(1);
      
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      const imgUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setThumbnails(prev => ({
        ...prev,
        [id]: imgUrl
      }));
    } catch (error) {
      console.error('Error generating thumbnail for document', id, ':', error);
    } finally {
      setLoadingThumbnails(prev => ({ ...prev, [id]: false }));
    }
  };

  // Generate thumbnails when documents change
  useEffect(() => {
    const generateThumbnailsForDocuments = async () => {
      for (const doc of filteredDocuments) {
        if (doc.ownFile && !thumbnails[doc.id] && doc.file instanceof Blob) {
          await generateThumbnail(doc.file, doc.id);
        }
      }
    };

    generateThumbnailsForDocuments();
  }, [filteredDocuments]);

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
  const handleEditName = async (id) => {
    const newName = prompt('Enter new name:');
    if (newName) {
      try {
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('title', newName);

        const response = await fetch(`${API_URL}/file`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!response.ok) throw new Error('Failed to update name');
        setFilteredDocuments((prev) =>
          prev.map((doc) => doc.id === id ? { ...doc, title: newName } : doc)
        );
      } catch (error) {
        alert('Error updating name: ' + error.message);
      }
    }
  };

  // Hàm xử lý sửa mô tả file
  const handleEditDescription = async (id) => {
    const newDescription = prompt('Enter new description:');
    if (newDescription) {
      try {
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('description', newDescription);

        const response = await fetch(`${API_URL}/file`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!response.ok) throw new Error('Failed to update description');
        setFilteredDocuments((prev) =>
          prev.map((doc) => doc.id === id ? { ...doc, description: newDescription } : doc)
        );
      } catch (error) {
        alert('Error updating description: ' + error.message);
      }
    }
  };

  // Hàm xử lý sửa category file
  const handleEditCategory = async (id) => {
    const doc = filteredDocuments.find((doc) => doc.id === id);
    if (!doc) return;
    const currentCategory = doc.category || '';
    const newCategory = window.prompt(
      `Select new category (enter number):\n` +
        CATEGORY_OPTIONS.map((opt, idx) => `${idx + 1}. ${opt.name}`).join('\n'),
      CATEGORY_OPTIONS.findIndex(opt => opt.id === currentCategory) + 1
    );
    const selectedOption = CATEGORY_OPTIONS[parseInt(newCategory, 10) - 1];
    if (selectedOption) {
      try {
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('cid', selectedOption.id);

        const response = await fetch(`${API_URL}/file`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!response.ok) throw new Error('Failed to update category');
        setFilteredDocuments((prev) =>
          prev.map((doc) => doc.id === id ? { ...doc, category: selectedOption.id } : doc)
        );
      } catch (error) {
        alert('Error updating category: ' + error.message);
      }
    }
  };

  // Hàm xử lý xóa file
  const handleDeleteFile = async (id) => {
    try {
      const formData = new URLSearchParams();
      formData.append('id', id);

      const response = await fetch(`${API_URL}/file`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      if (!response.ok) throw new Error('Failed to delete file');
      setFilteredDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      alert('Error deleting file: ' + error.message);
    }
  };

  // Hàm xử lý tải xuống file
  const handleDownloadFile = async (id) => {
    try {
      if (!id) {
        alert('Invalid file for download');
        return;
      }
      const response = await fetch(`${API_URL}/file?id=${id}&download=1`);
      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();

      // Try to get filename from Content-Disposition header
      let filename = 'download.pdf';
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 100);
    } catch (error) {
      alert('Error downloading file: ' + error.message);
    }
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
            {loadingThumbnails[doc.id] ? (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                <span className="text-xs text-gray-400">Generating preview...</span>
              </div>
            ) : thumbnails[doc.id] ? (
              <img
                src={thumbnails[doc.id]}
                alt="PDF Thumbnail"
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <FaFilePdf className="text-gray-300 text-5xl mb-2" />
                <span className="text-xs text-gray-400">No preview available</span>
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
            fileData={doc}
            onEdit={handleEditName}
            onEditDescription={handleEditDescription}
            onEditCategory={handleEditCategory}
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile}
          />
        </div>
      ))}
    </div>
  );
};

export default FileList;