import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ authToken }) => {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [downloadToken, setDownloadToken] = useState('');
  const [localID] = useState('e9yEHBoGlYgF1hfsbha8cX8iliw1');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const startUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    try {
      const nameimg = file.name;
      const imagesize = file.size;

      const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `jwt ${authToken}`,
        'X-Goog-Upload-Protocol': 'resumable',
        'Accept': '*/*',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Content-Length': `${imagesize}`,
        'Accept-Language': 'vi-VN,vi;q=0.9',
        'X-Firebase-Storage-Version': 'ios/10.13.0',
        'User-Agent': 'com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)',
        'X-Goog-Upload-Content-Type': file.type,
        'X-Firebase-Gmpid': '1:641029076083:ios:cc8eb46290d69b234fa606'
      };

      const data = JSON.stringify({
        name: `users/${localID}/moments/thumbnails/${nameimg}`,
        contentType: file.type,
        bucket: '',
        metadata: {
          creator: localID,
          visibility: 'private'
        }
      });

      const url = `https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${localID}%2Fmoments%2Fthumbnails%2F${nameimg}?uploadType=resumable&name=users%2F${localID}%2Fmoments%2Fthumbnails%2F${nameimg}`;
      const res = await axios.post(url, data, { headers });

      setUploadUrl(res.headers['x-goog-upload-url']);
    } catch (error) {
      console.error('Error starting upload:', error);
    }
  };

  const uploadImage = async () => {
    if (!file || !uploadUrl) {
      console.error('No file selected or upload URL not available');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Offset': '0',
        'X-Goog-Upload-Command': 'upload, finalize',
        'Upload-Incomplete': '?0',
        'Upload-Draft-Interop-Version': '3',
        'User-Agent': 'com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)'
      };

      await axios.put(uploadUrl, file, { headers });

      const headersGet = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `jwt ${authToken}`,
        'Accept': '*/*',
        'Accept-Language': 'vi-VN,vi;q=0.9',
        'User-Agent': 'com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)',
        'X-Firebase-Gmpid': '1:641029076083:ios:cc8eb46290d69b234fa606'
      };

      const res = await axios.get(`https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${localID}%2Fmoments%2Fthumbnails%2F${file.name}`, { headers: headersGet });
      setDownloadToken(res.data.downloadTokens);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const postMoment = async () => {
    if (!downloadToken) {
      console.error('Download token not available');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `jwt ${authToken}`,
        'Accept-Language': 'vi-VN,vi;q=0.9',
        'User-Agent': 'com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)'
      };

      const data = JSON.stringify({
        data: {
          analytics: {
            platform: 'ios',
            google_analytics: {
              app_instance_id: '7A58F101E5B043519DC9783D63D0A07F'
            },
            amplitude: {
              device_id: '5E1F6CFD-1FC9-4DED-82B1-03743DD1FE09',
              session_id: {
                '@type': 'type.googleapis.com/google.protobuf.Int64Value',
                value: '1722307848648'
              }
            }
          },
          thumbnail_url: `https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${localID}%2Fmoments%2Fthumbnails%2F${file.name}?alt=media&token=${downloadToken}`,
          sent_to_all: false,
          migration: {
            database: 'locket'
          },
          recipients: ['r77mY315k8OSFUHhe8jmV7Vq8rG2'],
          md5: 'b9e295674e4a3bb56d8e09ee78cc7748'
        }
      });

      const res = await axios.post('https://api.locketcamera.com/postMoment', data, { headers });
      console.log(res.data);
    } catch (error) {
      console.error('Error posting moment:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={startUpload}>Start Upload</button>
      <button onClick={uploadImage}>Upload Image</button>
      <button onClick={postMoment}>Post Moment</button>
    </div>
  );
};

export default ImageUpload;
