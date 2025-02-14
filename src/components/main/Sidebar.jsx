"use client";
import React from 'react';
import LeftbarNav from '../LeftbarNav';
import NotesPage from '@/app/notes/page';

const Sidebar = () => {
  return (
    <div className="w-1/3 h-full border-r border-solid border-gray flex flex-col">
      <LeftbarNav />
      <NotesPage />
    </div>
  );
};

export default Sidebar;