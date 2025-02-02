import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, ChevronRight, LogOut } from 'lucide-react';

const ChatInitPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mode: '',
    topic: '',
    subTopic: '',
    level: '',
    userId: 'user-123'
  });
  
  const topics = {
    'Stack': ['Basic Operations', 'Implementation', 'Applications'],
    'Queue': ['Basic Operations', 'Implementation', 'Circular Queue'],
    'Linked List': ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List'],
    // Add more topics and subtopics as needed
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      try {
        const response = await fetch(`http://127.0.0.1:8000/verify-token/${token}`);

        if(!response.ok){
          throw new Error('Token verification failed');
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
      const response = await fetch('http://localhost:5000/api/learning-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json(); 
        console.log(data);
        const chatId = data.id;
        navigate(`/chat/${chatId}`);
      }else {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
        <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              DSA Learning Assistant
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Customize your learning experience
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
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
                  <h3 className="font-medium text-gray-900 dark:text-white">Practical</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Hands-on coding practice</p>
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
  );
};

export default ChatInitPage;