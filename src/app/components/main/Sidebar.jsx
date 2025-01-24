"use client";
import React from 'react';
import LeftbarNav from '../LeftbarNav';

const Sidebar = () => {
  return (
    <div className="w-1/4 h-full border-r border-solid border-gray">
      <LeftbarNav />
    </div>
  );
};

export default Sidebar;