import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import { SignIn,useUser } from '@clerk/clerk-react';
function Layout() {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const {user} = useUser();
  return  user ? (
    <div className='flex flex-col h-screen'>
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img src={assets.logo} alt="logo" onClick={() => navigate('/')} className="h-8 cursor-pointer w-32 sm:w-44" />

        {sidebar ? (
          <X onClick={() => setSidebar(false)} className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer" />
        ) : (
          <Menu onClick={() => setSidebar(true)} className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer" />
        )}
      </nav>

      <div className='flex-1 w-full flex overflow-hidden'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB] overflow-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen '>
       <SignIn/>
    </div>
  )
}

export default Layout;