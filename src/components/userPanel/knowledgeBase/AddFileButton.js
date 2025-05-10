import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { API_URL } from '../../../constant';
const CATEGORY_OPTIONS = [
  { id: '1', name: 'IT' },
  { id: '2', name: 'BA' },
  { id: '3', name: 'EE' },
  { id: '4', name: 'EN' },
];

const AddFiletButton = ({ setFilteredDocuments, documentId }) => {

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    file: null, // Để lưu file
  });
  const [categories] = useState(CATEGORY_OPTIONS);

  // Hàm xử lý sự kiện khi người dùng thay đổi giá trị form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý sự kiện khi người dùng chọn tệp
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file,
    });
  };

  // Hàm xử lý khi người dùng submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData for API
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('cid', formData.category); // category id
    formDataToSend.append('author', formData.author);
    formDataToSend.append('did', documentId); // You need to provide the current document id here
    formDataToSend.append('description', formData.content);
    console.log('Uploading:', {
      title: formData.title,
      cid: formData.category,
      author: formData.author,
      did: documentId,
      description: formData.content,
      file: formData.file
    });
    if (formData.file) {
      formDataToSend.append('attachment', formData.file);
    }

    try {
      const response = await fetch(`${API_URL}/file`, {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      const newFile = await response.json();

      // Add the new file from API response to the list
      setFilteredDocuments((prevDocs) => [...prevDocs, newFile]);
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    }

    // Reset form after submit
    setFormData({
      title: '',
      content: '',
      category: '',
      author: '',
      file: null,
    });
    setShowForm(false);
  };

  const handleCancelFile = () => {
    setShowForm(false); // Ẩn form khi người dùng hủy
    setFormData({ // Reset form data
      title: '',
      content: '',
      category: '',
      author: '',
      file: null,
    });
  };

  return (
    <div>
      {/* Nút để hiển thị form */}
      <button
        onClick={() => setShowForm(true)}
        className="p-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
      >
        <FaPlus /> Add a New File
      </button>

      {/* Hiển thị form khi showForm là true */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleSubmit} className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Add New File</h2>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="content"
                name="content"
                rows="4"
                value={formData.content}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a brief description..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                id="author"
                name="author"
                type="text"
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Author name..."
                required
              />
            </div>

            {/* File */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Upload PDF File
              </label>
              <input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white file:cursor-pointer"
                accept="application/pdf"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelFile}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddFiletButton;