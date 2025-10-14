import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'

import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Community() {

  const [creations, setCreations] = useState([])
  const { user } = useUser();
  const [loading, setLoading] = useState(true);


  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-published-creation', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      console.log(data);
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(data.message);
    }
    setLoading(false);
  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        // Update state locally
        setCreations((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                ...c,
                likes: c.likes.includes(user.id)
                  ? c.likes.filter((u) => u !== user.id)
                  : [...c.likes, user.id],
              }
              : c
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold">Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll p-3">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt="Creation"
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="mt-2">
              <p className="text-sm text-gray-600 hidden group-hover:block">
                {creation.prompt}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-700">{creation.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer transition-transform duration-150`}
                  fill={creation.likes.includes(user.id) ? 'red' : 'none'}
                  stroke={creation.likes.includes(user.id) ? 'red' : 'currentColor'}
                />

              </div>
            </div>
          </div>
        ))}
        {/* 
    <div className="mt-4 text-center">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Subscribe
      </button>
      <p className="text-gray-500 text-sm mt-2">HD</p>
    </div> */}
      </div>
    </div>

  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></span>
    </div>

  )
}

export default Community