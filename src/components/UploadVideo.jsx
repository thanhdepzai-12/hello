// src/Upload.js
import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const UploadVideo = ({ authToken }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };
  console.log("check token upload video", authToken);
  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn một tệp.");
      return;
    }

    // Tải lên Firebase Storage
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        setError("Lỗi khi tải lên: " + error.message);
      },
      async () => {
        // Lấy URL tải xuống
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadURL);

        // Gửi hình ảnh đến Locket
        try {
          await axios.post('https://api.locket.com/upload', {
            imageUrl: downloadURL
          }, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
        } catch (error) {
  console.error('Error:', error.response ? error.response.data : error.message);
  setError("Lỗi khi gửi hình ảnh đến Locket: " + (error.response ? error.response.data : error.message));
}
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <progress value={progress} max="100" />
      {url && <img src={url} alt="Uploaded content" />}
    </div>
  );
};

export default UploadVideo;
