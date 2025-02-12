import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, BookOpen, Code, Calendar, Trash2 } from 'lucide-react';

const PreviousChats = ({ userId, navigate }) => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/previous_prefs/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getModeIcon = (mode) => {
    return mode === 'theory' ? 
      <BookOpen className="w-4 h-4 text-blue-500" /> : 
      <Code className="w-4 h-4 text-green-500" />;
  };

  if (isLoading) {
    return (
      <div className="w-80 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ml-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const handleDelete = async (chatId, e) => {
    e.stopPropagation(); // Prevent triggering the parent button click
    try {
      const response = await fetch(`http://127.0.0.1:8000/deletepref/${chatId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setChats(chats.filter(chat => chat.id !== chatId));
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className="w-80 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ml-4">

      <div className="space-y-3">
        {chats.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No previous sessions found</p>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getModeIcon(chat.mode)}
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {chat.topic}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {chat.subTopic}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                      onClick={(e) => handleDelete(chat.id, e)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300" />
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(chat.createdAt)}</span>
                </div>
                <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 capitalize">
                  {chat.level}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default PreviousChats;