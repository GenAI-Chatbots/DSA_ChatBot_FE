import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Plus, MessageSquare, Loader2, ChevronDown, ChevronRight, Copy, Check, Trash2, LogOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PreferenceDisplay from './preferenceDisplay';
import ImageGallerySidebar from './imageGallerySidebar';
import FullScreenPreview from './fullScreenPreview';

const generateSessionId = () => { 
    return 'user' + Math.floor(Math.random() * 1000);
}

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-300">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{code}</code>
      </pre>
    </div>
  );
};

const Exercise = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 text-left"
      >
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Exercise</div>
          <h3 className="font-medium text-gray-900 dark:text-white">{exercise.title}</h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="font-medium text-gray-900 dark:text-white">Question:</div>
            <p className="text-gray-700 dark:text-gray-300">{exercise.question}</p>
          </div>

          {exercise.code && (
            <CodeBlock code={exercise.code} language={exercise.language || 'java'} />
          )}

          <div className="mt-4">
            <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <div className="font-medium">Hint:</div>
              <p>{exercise.hint}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="my-4">
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Stack visualization" 
                className="w-full h-auto"
                onClick={(e) => e.stopPropagation()}
              />
              <button 
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div 
            key={index} 
            className="relative aspect-w-16 aspect-h-9 cursor-pointer rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={() => setSelectedImage(url)}
          >
            <img 
              src={url} 
              alt={`Stack visualization ${index + 1}`}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// const ChatMessage = ({ message, isUser }) => {
//   const processContent = (content) => {
//     if (typeof content !== 'string') return content;

//     if (content.includes('Exercise:')) {
//       const exerciseData = {
//         title: content.match(/Exercise: (.*?)(?:\n|$)/)?.[1] || 'Practice Exercise',
//         question: content.match(/Question:(.*?)(?=Hint:|\n\n|$)/s)?.[1]?.trim() || '',
//         hint: content.match(/Hint:(.*?)(?=\n\n|$)/s)?.[1]?.trim() || '',
//         code: content.match(/```.*?\n([\s\S]*?)```/)?.[1] || '',
//         language: content.match(/```(.*?)\n/)?.[1] || 'java'
//       };

//       return (
//         <div className="space-y-4">
//           <Exercise exercise={exerciseData} />
//         </div>
//       );
//     }

//     if (content.includes('```')) {
//       const parts = content.split(/(```[\s\S]*?```)/g);
//       return parts.map((part, index) => {
//         if (part.startsWith('```') && part.endsWith('```')) {
//           const language = part.match(/```(.*?)\n/)?.[1] || '';
//           const code = part.replace(/```.*?\n/, '').replace(/```$/, '');
//           return <CodeBlock key={index} code={code} language={language} />;
//         }
//         return <p key={index} className="text-gray-700 dark:text-gray-300">{part}</p>;
//       });
//     }

//     return <p className="text-gray-700 dark:text-gray-300">{content}</p>;
//   };

//   return (
//     <div className={`border-b border-gray-100 dark:border-gray-800 ${
//       isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
//     }`}>
//       <div className="max-w-3xl mx-auto px-4 py-6">
//         <div className="flex space-x-4">
//           <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
//             isUser ? 'bg-gray-500' : 'bg-emerald-500'
//           }`}>
//             {isUser ? 'U' : 'T'}
//           </div>
          
//           <div className="flex-1 space-y-2">
//             {processContent(message.content)}
            
//             {message.feedback && (
//               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <p className="font-medium mb-2">Feedback:</p>
//                 <p>{message.feedback}</p>
//               </div>
//             )}
            
//             {message.sources && message.sources.length > 0 && (
//               <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
//                 <p className="font-medium mb-1">Sources:</p>
//                 {message.sources.map((source, idx) => (
//                   <p key={idx} className="ml-2">
//                     • {source.lecture_title} - {source.section_type}
//                     {source.subsection && ` (${source.subsection})`}
//                   </p>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const ChatMessage = ({ message, isUser }) => {
  const processContent = (content) => {
    if (typeof content !== 'string') return content;

    if (content.includes('Exercise:')) {
      const exerciseData = {
        title: content.match(/Exercise: (.*?)(?:\n|$)/)?.[1] || 'Practice Exercise',
        question: content.match(/Question:(.*?)(?=Hint:|\n\n|$)/s)?.[1]?.trim() || '',
        hint: content.match(/Hint:(.*?)(?=\n\n|$)/s)?.[1]?.trim() || '',
        code: content.match(/```.*?\n([\s\S]*?)```/)?.[1] || '',
        language: content.match(/```(.*?)\n/)?.[1] || 'java'
      };

      return (
        <div className="space-y-4">
          <Exercise exercise={exerciseData} />
        </div>
      );
    }

    if (content.includes('```')) {
      const parts = content.split(/(```[\s\S]*?```)/g);
      return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const language = part.match(/```(.*?)\n/)?.[1] || '';
          const code = part.replace(/```.*?\n/, '').replace(/```$/, '');
          return <CodeBlock key={index} code={code} language={language} />;
        }
        return <FormattedText key={index} text={part} />;
      });
    }

    return <FormattedText text={content} />;
  };

  return (
    <div className={`border-b border-gray-100 dark:border-gray-800 ${
      isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
    }`}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex space-x-4">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-gray-500' : 'bg-emerald-500'
          }`}>
            {isUser ? 'U' : 'T'}
          </div>
          
          <div className="flex-1 space-y-2">
            {processContent(message.content)}
            
            {message.image_urls && message.image_urls.length > 0 && (
              <ImageGallery images={message.image_urls} />
            )}
            
            {message.feedback && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="font-medium mb-2">Feedback:</p>
                <p>{message.feedback}</p>
              </div>
            )}
            
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium mb-1">Sources:</p>
                {message.sources.map((source, idx) => (
                  <p key={idx} className="ml-2">
                    • {source.lecture_title} - {source.section_type}
                    {source.subsection && ` (${source.subsection})`}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// New component to handle text formatting
const FormattedText = ({ text }) => {
  const formatText = (text) => {
    // First, split the text into sentences
    const sentences = text.split(/(?<=\?|\.|!)\s+/);
    
    return sentences.map((sentence, sentenceIndex) => {
      // Check if the sentence is a question
      const isQuestion = sentence.trim().endsWith('?');
      
      // If it's a numbered point, process it differently
      if (/^\d+\./.test(sentence)) {
        const [numberPart, ...restParts] = sentence.split(/(?<=\d\.)\s+/);
        const number = numberPart.trim().replace('.', '');
        const content = restParts.join(' ');
        
        const processedContent = processTextParts(content);
        
        return (
          <div key={sentenceIndex} className="flex space-x-4 py-2">
            {/* <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
              {number}
            </div> */}
            <div className="flex-1 text-gray-700 dark:text-gray-300">
              {processedContent}
            </div>
          </div>
        );
      }
      
      // For questions, wrap in a special container
      if (isQuestion) {
        return (
          <div key={sentenceIndex} className="my-2 p-3 bg-white-50 dark:bg-gray-900/20 border-l-4 border-white-400 dark:border-white-500 rounded">
            <div className="flex items-start space-x-2">
              {/* <span className="text-purple-500 dark:text-purple-400 mt-1">?</span> */}
              <span className="text-gray-800 dark:text-gray-200">
                {processTextParts(sentence)}
              </span>
            </div>
          </div>
        );
      }
      
      // For regular sentences
      return (
        <p key={sentenceIndex} className="text-gray-700 dark:text-gray-300">
          {processTextParts(sentence)}
        </p>
      );
    });
  };
  
  // Helper function to process bold text and other formatting
  const processTextParts = (text) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <span key={i} className="font-semibold text-gray-900 dark:text-white bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
            {boldText}
          </span>
        );
      }
      return part;
    });
  };

  return <div className="space-y-2">{formatText(text)}</div>;
};



const Sidebar = ({ isOpen, onClose, onClearSession, isClearing , id, learningPreference, images, setPreviewImage, conversationId, setConversationId, setMessages}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const clickNewChat = () => {
    navigate('/')
  }

  const clearConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/deleteconv/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      setConversationId(null)
      setMessages([])
    } catch (error) {
      console.error('Error deleting conversation:', error);
      // You might want to add a toast notification here for error feedback
    }
  }

  return(
    <div className={`fixed left-0 top-0 bottom-0 w-96 bg-gray-900 transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-200 ease-in-out md:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="p-4 space-y-2">
          <div style={{color:"white"}}>Chat Id:  {id}</div>
          <button onClick={clickNewChat} className="w-full flex items-center justify-start space-x-2 px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white transition-colors">
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
          
          <button 
            onClick={clearConversation}
            disabled={isClearing}
            className="w-full flex items-center justify-start space-x-2 px-3 py-2 border border-red-700 rounded-lg hover:bg-red-700/20 text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Clear Conversation</span>
          </button>
        </div>

        <div>
        <PreferenceDisplay preferences={learningPreference} />
        </div>


          <div className="text-gray-400 text-sm px-4 py-2">Relevent Images & Docs</div>
          <div className="px-4 py-2 space-y-2 h-[calc(100vh-120px)] pb-10 overflow-y-auto
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
          ">
            <div className="px-4  mt-2 " >
              <ImageGallerySidebar images={images || []}  setPreviewImage={setPreviewImage}/>
            </div>
          </div>
  
        <div className="p-6 border-t border-gray-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-start space-x-2 px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
      </div>
    </div>
  )
};

const DSATutorChat = () => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [sessionId] = useState('user333');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [learningPreference, setLearningPreference] = useState(null);
  const [images, setImages] = useState([])
  const [processImages, setProcessImages] = useState([])
  const messagesEndRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  const { id } = useParams();

 // const preferences = JSON.parse(localStorage.getItem('chatPreferences') || '{}');
  // Fetch existing conversation and messages
  const fetchExistingConversation = async (preferenceId, userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/conversation/${preferenceId}/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      
      const data = await response.json();
      
      // Check if data and data.conversation exist before accessing properties
      if (data && data.conversation) {
        setConversationId(data.conversation._id);
        // Convert stored messages to the format our UI expects
        const formattedMessages = data.conversation.messages.map(msg => ({
          content: msg.content,
          isUser: msg.role === 'user',
          feedback: msg.feedback,
          sources: msg.sources,
          image_urls: msg.image_urls
        }));
        setMessages(formattedMessages);
      } else {
        // Handle case where there's no existing conversation
        console.log('No existing conversation found');
        setConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      // Optionally set some error state or show an error message to the user
      setConversationId(null);
      setMessages([]);
    }
  };

  useEffect(() => {
    // If no preferences are set, redirect to init page
    // if (!preferences.topic) {
    //   navigate('/');
    // }
    
    fetchLearningPreference(id);
  }, []);

  //  useEffect(() => {
  //     const verifyToken = async () => {
  //       const token = localStorage.getItem('token');
  //       console.log('Token:', token);
  
  //       try {
  //         if(token !== null) {
  //           const response = await fetch(`http://127.0.0.1:8000/verify-token/${token}`);
  
  //           if(!response.ok){
  //             throw new Error('Token verification failed');
  //           }
  //         }else{
  //           navigate('/auth');
  //         }
  //       } catch (error) {
  //         localStorage.removeItem('token');
  //         navigate('/auth');
  //       }
  //     }

  //     const verifyId = async () => {
  //       try {
  //         if(id !== null) {
  //           const response = await fetch(`http://127.0.0.1:8000/verify-chat/${id}`)

  //           if(!response.ok){
  //             throw new Error('Chat verification failed');
  //           }
  
  //         }else{
  //           navigate('/');
  //         }
  //       } catch (error) {
  //         localStorage.removeItem('token');
  //         navigate('/');
  //       }
  //     }
  
  //     verifyToken();
  //     verifyId();
  //   }, [navigate]);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        // Step 1: Verify Token
        const tokenResponse = await fetch(`http://127.0.0.1:8000/verify-token/${token}`);

        if (!tokenResponse.ok) {
          throw new Error("Token verification failed");
        }

        // Step 2: Verify Chat ID (only if Token is valid)
        if (!id) {
          navigate("/");
          return;
        }

        const idResponse = await fetch(`http://127.0.0.1:8000/verify-chat/${id}`);

        if (!idResponse.ok) {
          throw new Error("Chat verification failed");
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    };

    verify();
  }, [id, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearSession = async () => {
    if (isClearing) return;
    
    setIsClearing(true);
    try {
      const response = await fetch('http://localhost:5000/clear-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        setMessages([{
          content: 'Session cleared successfully. You can start a new conversation.',
          isUser: false,
        }]);
      } else {
        throw new Error('Failed to clear session');
      }
    } catch (error) {
      console.error('Error clearing session:', error);
      setMessages(prev => [...prev, {
        content: 'Failed to clear session. Please try again.',
        isUser: false,
      }]);
    } finally {
      setIsClearing(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!input.trim() || isLoading) return;

  //   const userMessage = input;
  //   setInput('');
  //   setIsLoading(true);

  //   setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    
  //   if(conversationId === null){
  //     fetchExistingConversation(id, learningPreference.userId);
  //   }

  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         conversation_id: conversationId,
  //         learning_mode: learningPreference.mode,  
  //         topic: learningPreference.topic,
  //         sub_topic: learningPreference.subTopic,
  //         student_level: learningPreference.level,
  //         user_input: userMessage,
  //         user_id:  learningPreference.userId,
  //         preference_id: id
  //       }),
  //     });

  //     const data = await response.json();

  //     console.log("data: ", data.response)
      
  //     const botMessage = {
  //       content: data.response,
  //       isUser: false,
  //       feedback: data.feedback,
  //       sources: data.sources,
  //       next_question: data.next_question,
  //       image_urls: data.image_urls
  //     };

  //     setMessages(prev => [...prev, botMessage]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setMessages(prev => [...prev, {
  //       content: 'Sorry, there was an error processing your request.',
  //       isUser: false,
  //     }]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    console.log('ConversationId changed:', conversationId);
  }, [conversationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    const userMessage = input;
    setInput('');
    setIsLoading(true);
  
    // Add user message to UI immediately
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
  
    try {
  
      // Now send the chat message with the latest conversationId
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId, // This will be null for first message, creating new conversation
          learning_mode: learningPreference.mode,  
          topic: learningPreference.topic,
          sub_topic: learningPreference.subTopic,
          student_level: learningPreference.level,
          user_input: userMessage,
          user_id: learningPreference.userId,
          preference_id: id,
          relevant_images: processImages
        }),
      });
  
      const data = await response.json();
  
      // If this was the first message, update conversationId from response
      if (conversationId === null && data.conversation_id) {
        setConversationId(data.conversation_id);
      }
  
      const botMessage = {
        content: data.response,
        isUser: false,
        feedback: data.feedback,
        sources: data.sources,
        next_question: data.next_question,
        image_urls: data.image_urls
      };
  
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: 'Sorry, there was an error processing your request.',
        isUser: false,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLearningPreference = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/pref/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch learning preference");
      }
      const data = await response.json();
      setLearningPreference(data);

      fetchExistingConversation(id, data.userId)
      fetchImages(data.topic)

      console.log("Learning Preference:", learningPreference);

    } catch (error) {
      console.error("Error fetching learning preference:", error);
    }
  };

  const fetchImages = async (topic) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/topic-images/${topic}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch learning preference");
      }
      const data = await response.json();
      setImages(data.images)

      processImageData(data.images)

    }catch{
      console.error("Error fetching images:", error);
    }
  }

  const processImageData = (imageArray) => {
    let processImages = imageArray.map(item => ({
      imageNumber: item.imageNo,
      imageDescription: item.imageDes
    })).sort((a, b) => a.imageNumber - b.imageNumber);

    setProcessImages(processImages)
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-800">

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onClearSession={handleClearSession}
        isClearing={isClearing}
        id={id}
        learningPreference={learningPreference}
        images={images}
        setPreviewImage={setPreviewImage}
        conversationId={conversationId}
        setConversationId={setConversationId} 
        setMessages={setMessages}
      />

      <>
        {/* Existing JSX */}
        <FullScreenPreview 
          image={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      </>
      
      <div className="flex-1 flex flex-col md:ml-64">
        <div className="md:hidden flex items-center p-4 border-b dark:border-gray-700">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-700 dark:text-gray-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center px-4">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">DSA Tutor</h1>
                <p className="text-gray-600 dark:text-gray-300">Start a conversation about Stack data structure</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} isUser={msg.isUser} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about data structures..."
                className="w-full p-4 pr-12 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSATutorChat;