import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center flex-col gap-6 animate-pulse">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
      <p className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        GAMEHUB PRO
      </p>
    </div>
  );
};

export default Loading;
