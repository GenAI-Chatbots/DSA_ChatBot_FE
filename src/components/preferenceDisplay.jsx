import React from 'react';
import { Book, Brain, BarChart, User, Settings } from 'lucide-react';

const PreferenceDisplay = ({ preferences }) => {
  if (!preferences) return null;

  const preferenceItems = [
    {
      icon: <Settings className="w-4 h-4" />,
      label: "Learning Mode",
      value: preferences.mode,
      color: "text-blue-400"
    },
    {
      icon: <Book className="w-4 h-4" />,
      label: "Topic",
      value: preferences.topic,
      color: "text-green-400"
    },
    {
      icon: <Brain className="w-4 h-4" />,
      label: "Sub Topic",
      value: preferences.subTopic,
      color: "text-purple-400"
    },
    {
      icon: <BarChart className="w-4 h-4" />,
      label: "Level",
      value: preferences.level,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="text-sm text-gray-400 font-medium mb-2">Learning Preferences</div>
      <div className="space-y-2">
        {preferenceItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800">
            <div className={`${item.color}`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400">{item.label}</div>
              <div className="text-sm text-gray-200">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreferenceDisplay;