import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import WriteArticle from './pages/WriteArticle.jsx';
import BlogTitles from './pages/BlogTitles.jsx'
import GenerateImage from './pages/GenerateImages.jsx'
import Removebackground from './pages/RemoveBackground.jsx'
import Removeobject from './pages/RemoveObject.jsx'
import Reviewresume from './pages/ReviewResume.jsx';
import Community from './pages/Community.jsx'
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Toaster from 'react-hot-toast';

function App() {

    const { getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      console.log(token); // ✅ this will print the token
    };

    fetchToken();
  }, [getToken]);
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImage />} />
          <Route path='remove-background' element={< Removebackground/>} />
           <Route path='remove-object' element={<Removeobject/>}/>
          <Route path='review-resume' element={<Reviewresume />} />
          <Route path='community' element={<Community />} />
        </Route>
      </Routes>

    </div>
  )
}

export default App