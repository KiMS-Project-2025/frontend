import React, { useState } from 'react';
import Filters from './Filters';  // Import Filters component
import FileList from './FileList';  // Import FileList component
import AddFileButton from './AddFileButton';  // Import AddFileButton component

const Body = ({ filteredDocuments, setFilteredDocuments }) => {
    const [selectedFile, setSelectedFile] = useState(null);  // State để lưu file PDF đã chọn
    const [fileName, setFileName] = useState('');  // Lưu tên file
    const [showConfirm, setShowConfirm] = useState(false);

    // Hàm xử lý khi người dùng chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];  // Lấy file được chọn
        if (file) {
            setSelectedFile(file);  // Lưu file vào state
            setFileName(file.name);  // Lưu tên file vào state
            setShowConfirm(true);
        }
    };

    // Hàm xử lý nhấn nút Add a New Document
    const handleAddFile = () => {
        // Mở input file khi nhấn vào nút
        document.getElementById('fileInput').click();
    };

    // Hàm xử lý thêm file vào FileList
    const handleConfirmFile = () => {
        const newFile = {
          id: filteredDocuments.length + 1,  // Tạo id mới cho file
          title: fileName,  // Dùng tên file làm tiêu đề
          shortDescription: `File: ${fileName}`,
          uploadDate: new Date().toLocaleDateString(),  // Ngày tải lên
          ownFile: true,  // Đánh dấu đây là file đã chọn
          file: selectedFile,  // Lưu file PDF vào tài liệu
        };
    
        // Cập nhật danh sách tài liệu
        setFilteredDocuments([...filteredDocuments, newFile]);
    
        // Reset lại state sau khi thêm tài liệu
        setSelectedFile(null);
        setFileName('');
        setShowConfirm(false);  // Ẩn trang xác nhận
      };

      const handleCancelFile = () => {
        setShowConfirm(false);  // Ẩn trang xác nhận
        setSelectedFile(null);  // Reset file đã chọn
        setFileName('');  // Reset tên file
      };

    return (
        <div>
            {/* Body */}
            <div className="flex justify-between p-6">
                {/* Left: Add File Button */}
                <AddFileButton handleAddFile={handleAddFile} />

                {/* Right: Filters */}
                <Filters />
            </div>

            {/* File List */}
            <div className="px-6">
                <FileList filteredDocuments={filteredDocuments} />
            </div>

            {/* File Input (ẩn đi) */}
            <input
                id="fileInput"
                type="file"
                accept="application/pdf"  // Chỉ cho phép chọn file PDF
                onChange={handleFileChange}  // Gọi hàm khi người dùng chọn file
                style={{ display: 'none' }}  // Ẩn input file
            />

            {/* Trang xác nhận */}
            {showConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="font-semibold text-xl mb-4">Confirm File Upload</h3>
                        <p><strong>File Name:</strong> {fileName}</p>
                        <p><strong>Are you sure you want to upload this file?</strong></p>

                        {/* Confirm Button */}
                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={handleConfirmFile}
                                className="p-2 bg-blue-600 text-white rounded-lg"
                            >
                                Confirm
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={handleCancelFile}
                                className="p-2 bg-gray-600 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Body;