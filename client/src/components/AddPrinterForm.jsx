import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const AddPrinterForm = () => {
  const [printerName, setPrinterName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [information, setInformation] = useState("");
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setError(""); // Xóa lỗi nếu có
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setFile(file); // Lưu file vào state
      } else {
        setError("Please upload a valid JPG or PNG file.");
        setSelectedImage(null);
      }
    }
  };

  useEffect(() => {
    // Dọn dẹp URL khi thành phần bị hủy
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!printerName || !information || !type || !price || !file) {
      setError("All fields are required");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/printers/create",
        {
          name: printerName,
          price: price,
          type: type,
          information: information,
          image: `../public/${file.name}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Printer added successfully!");
        // Clear form
        setPrinterName("");
        setType("");
        setPrice("");
        setInformation("");
        setFile(null);
        setSelectedImage(null);
        setError("");
        // Redirect to /printers
        navigate("/printers");
      } else {
        setError(response.data.message || "Failed to add printer");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className="pt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-3/4 mx-auto"
        style={{padding: '10px 20px'}}
      >
        <h2 className="text-lg font-semibold mb-4 text-center">Add Printer</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-medium mb-1">Name:</label>
            <input
              type="text"
              value={printerName}
              onChange={(e) => setPrinterName(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Type:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Price:</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4 col-grid-2">
            <label className="block font-medium mb-1">Information:</label>
            <textarea
              value={information}
              onChange={(e) => setInformation(e.target.value)}
              className="border rounded w-full p-2"
            ></textarea>
          </div>
          {/* Picture */}
          <div className="mb-2 col-span-2">
            <label className="block font-medium mb-2">
              Picture of Printer:
            </label>
            <div className="border border-dashed border-gray-400 rounded flex justify-center items-center p-2">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                className="cursor-pointer text-black"
              />
              {error && <p className="text-red-500">{error}</p>}
              {selectedImage && (
                <div>
                  <p className="text-blue-500">Image preview:</p>
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{ width: "auto", height: "240px" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Link
            to="/printers"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded">
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPrinterForm;
