import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './auth/Login.jsx';
import UploadVideo from './components/UploadVideo.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUpload from './components/ImageUpload.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: < App/>,
  },
  {
    path: "/login",
    element: < Login/>,
  },
    {
    path: "/UploadVideo",
    element: < UploadVideo/>,
  },
        {
    path: "/UploadImage",
    element: < ImageUpload/>,
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
