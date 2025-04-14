import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, ChevronRight, LogOut, ChevronLeft } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import PreviousChats from './previousChats';
import BASE_URL from '../config';

const ChatInitPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mode: '',
    topic: '',
    subTopic: '',
    level: '',
    userId: ''
  });
  const [topics, setTopics] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // const topics = {
  //   'stack': ['Basic Operations', 'Implementation', 'Applications'],
  //   'queue': ['Basic Operations', 'Implementation', 'Applications'],
  //   'linkedlist': ['Basic Operations', 'Implementation', 'Applications'],
  // };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${BASE_URL}/all-topics`);
        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            // Transform array into an object with topics as keys
            const formattedTopics = data.reduce((acc, topic) => {
              acc[topic] = ["Basic Operations", "Implementation", "Applications"];
              return acc;
            }, {});

            setTopics(formattedTopics);
          } else {
            console.error("Invalid data format:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if(token !== null) {
        const decoded = jwtDecode(token);
        setFormData(prev => ({
          ...prev,
          userId: decoded.userId
        }));
      }

      try {
        if(token !== null) {
          const response = await fetch(`${BASE_URL}/verify-token/${token}`);
          if(!response.ok) throw new Error('Token verification failed');
        } else {
          navigate('/auth');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }

    verifyToken();
  }, [navigate]);
  
  const handleModeSelect = (mode) => {
    setFormData(prev => ({ ...prev, mode }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/pref`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        // Second API call to /initialize-rag - now without body
        const ragResponse = await fetch(`${BASE_URL}/initialize-rag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!ragResponse.ok) {
          throw new Error('Failed to initialize RAG');
        }

        const ragData = await ragResponse.json();

        // setA({
        //   show: true,
        //   message: ragData.message,
        //   results: ragData.results
        // });
        alert(ragData.message)
    
        // Navigate after a short delay to show the alert
        setTimeout(() => {
          navigate(`/chat/${data.id}`);
        }, 2000);

        // navigate(`/chat/${data.id}`);
      } else {
        console.error('Failed to submit learning preferences');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* State for sidebar visibility */}
      
  
      {/* Sidebar */}
      <div 
        id='sidebar' 
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto fixed left-0 h-screen transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-90' : 'w-0'
        }`}
      >
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Previous Learning Sessions
          </h2>
        </div>
        <div 
          className="h-[calc(100vh-120px)] pb-10 overflow-y-auto
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-track]:dark:bg-gray-700
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:dark:bg-gray-600
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:border-2
            [&::-webkit-scrollbar-thumb]:border-gray-100
            [&::-webkit-scrollbar-thumb]:dark:border-gray-700
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
            hover:[&::-webkit-scrollbar-thumb]:dark:bg-gray-500
            [&::-webkit-scrollbar-thumb]:transition-colors
            [&::-webkit-scrollbar]:hover:w-2
          "
        >
          <PreviousChats userId={formData.userId} navigate={navigate} />
        </div>
      </div>
  
      {/* Toggle Button - Fixed to the left side of the screen */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-4 z-50 transition-all duration-300 p-2 rounded-r-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 ${
          sidebarOpen ? 'left-80' : 'left-0'
        }`}
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
  
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Data Structures Learning Assistant
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Customize your learning experience
              </p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              {/* Mode Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                  Choose Learning Mode
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleModeSelect('theory')}
                    className={`p-6 rounded-lg border-2 flex items-center space-x-4 transition-all ${
                      formData.mode === 'theory'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-200'
                    }`}
                  >
                    <BookOpen className="w-8 h-8 text-blue-500" />
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">Theory</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Learn concepts and principles</p>
                    </div>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => handleModeSelect('practical')}
                    className={`p-6 rounded-lg border-2 flex items-center space-x-4 transition-all ${
                      formData.mode === 'practical'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-200'
                    }`}
                  >
                    <Code className="w-8 h-8 text-green-500" />
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">Coding</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Learn Coding concepts and implementations</p>
                    </div>
                  </button>
                </div>
              </div>
  
              {/* Topic Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                  Select Topic
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value, subTopic: '' }))}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a topic</option>
                  {Object.keys(topics).map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
  
              {/* Sub Topic Selection */}
              {formData.topic && (
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                    Select Sub Topic
                  </label>
                  <select
                    value={formData.subTopic}
                    onChange={(e) => setFormData(prev => ({ ...prev, subTopic: e.target.value }))}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select a sub topic</option>
                    {topics[formData.topic]?.map(subTopic => (
                      <option key={subTopic} value={subTopic}>{subTopic}</option>
                    ))}
                  </select>
                </div>
              )}
  
              {/* Difficulty Level */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                  Select Difficulty Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select difficulty level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
  
              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formData.mode || !formData.topic || !formData.subTopic || !formData.level}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <span>Start Learning</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInitPage;