import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FaEllipsisV, FaFilePdf } from 'react-icons/fa';
import FileMenu from './FileMenu';  // Import component menu ba chấm
import { API_URL } from '../../../constant';
import ModalCategory from './modalCategory';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const CATEGORY_MAP = {
  '1': 'IT',
  '2': 'BA',
  '3': 'EE',
  '4': 'EN',
};

const FileList = ({ filteredDocuments, setFilteredDocuments }) => {
  const [thumbnails, setThumbnails] = useState({});  // State để lưu ảnh thumbnail của các file PDF
  const [activeMenu, setActiveMenu] = useState(null);  // State để quản lý menu ba chấm
  const [menuPosition, setMenuPosition] = useState(null); // State để lưu vị trí của menu
  const [loadingThumbnails, setLoadingThumbnails] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryEditDoc, setCategoryEditDoc] = useState(null);

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

      // Get the original viewport
      const originalViewport = page.getViewport({ scale: 2.5 });
      
      // Calculate scale to fit width
      const scale = 2;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Set canvas dimensions
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render only the top portion of the page
      await page.render({
        canvasContext: context,
        viewport: viewport,
        transform: [1, 0, 0, 1, 0, 0], // No translation, show from top
        intent: 'display'
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
        if (!thumbnails[doc.id]) {
          try {
            setLoadingThumbnails(prev => ({ ...prev, [doc.id]: true }));

            // Fetch PDF từ API
            const response = await fetch(`${API_URL}/file?id=${doc.id}`);
            if (!response.ok) throw new Error(`Failed to fetch file ${doc.id}`);
            const blob = await response.blob();

            // Gọi generateThumbnail
            await generateThumbnail(blob, doc.id);
          } catch (error) {
            console.error("Error loading PDF for thumbnail:", error);
          } finally {
            setLoadingThumbnails(prev => ({ ...prev, [doc.id]: false }));
          }
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

  // Hàm xử lý sửa category file (now opens modal)
  const handleEditCategory = (id) => {
    const doc = filteredDocuments.find((doc) => doc.id === id);
    if (!doc) return;
    setCategoryEditDoc(doc);
    setShowCategoryModal(true);
  };

  // Save handler for ModalCategory
  const handleSaveCategory = async (id) => {
    if (!categoryEditDoc) return;
    try {
      const formData = new URLSearchParams();
      formData.append('id', categoryEditDoc.id);
      formData.append('cid', id);
      const response = await fetch(`${API_URL}/file`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (!response.ok) throw new Error('Failed to update category');

      setFilteredDocuments((prev) =>
        prev.map((doc) =>
          doc.id === categoryEditDoc.id ? { ...doc, category: getNameById(id) } : doc
        )
      );
      setShowCategoryModal(false);
      setCategoryEditDoc(null);
    } catch (error) {
      alert('Error updating category: ' + error.message);
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

  const getNameById = (id) => {
    const category = CATEGORY_OPTIONS.find(item => item.id === id);
    return category ? category.name : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDocuments.map((doc) => (
        <div key={doc.id} className="bg-white rounded-2xl shadow hover:shadow-md border border-gray-100 transition-all duration-200 overflow-hidden">
          {/* Header with PDF icon and title */}
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center">
              <FaFilePdf className="text-red-500 text-xl" />
              <h3 className="ml-3 font-semibold text-gray-800 truncate max-w-[180px]">{doc.title || "Untitled Document"}</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Category tag */}
              {(getNameById(doc.cid)) && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                    getNameById(doc.cid) === 'IT' ? 'bg-blue-500 text-white' :
                    getNameById(doc.cid) === 'BA' ? 'bg-green-500 text-white' :
                    getNameById(doc.cid) === 'EE' ? 'bg-yellow-500 text-gray-800' :
                    getNameById(doc.cid) === 'EN' ? 'bg-indigo-500 text-white' :
                    'bg-red-400 text-white'
                  }`}
                >
                  {getNameById(doc.cid)}
                </span>
              )}
              <button
                onClick={(e) => toggleMenu(e, doc.id)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition"
              >
                <FaEllipsisV />
              </button>
            </div>
          </div>

          {/* PDF thumbnail preview */}
          <div className="h-fix bg-gray-50 flex items-center justify-center">
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
                style={{ objectPosition: 'top' }}
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
              {doc.shortDescription || doc.description || "Untitled Document"}
            </p>
            <div className="text-xs text-gray-400">
              Uploaded: {new Date(doc.modified_at).toLocaleString() || "Date not available"}
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
      <ModalCategory
        isOpen={showCategoryModal}
        onClose={() => { setShowCategoryModal(false); setCategoryEditDoc(null); }}
        onSave={handleSaveCategory}
        initialCategory={categoryEditDoc ? categoryEditDoc.category : ''}
      />
    </div>
  );
};

export default FileList;