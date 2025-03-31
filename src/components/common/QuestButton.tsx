import React from 'react';

interface QuestButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const QuestButton: React.FC<QuestButtonProps> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="w-full p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
    >
        {children}
    </button>
);

export default QuestButton;
