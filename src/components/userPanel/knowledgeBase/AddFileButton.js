import React, {useState} from 'react';
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Add New Document</h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="content"
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                name="author"
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>

            {/* File */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Upload File</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                accept="application/pdf"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg">
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancelFile}
                className="p-2 bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddFiletButton;