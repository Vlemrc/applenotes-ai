"use client";
import React from 'react';
import { dataNotes, dataDeleteNotes} from '@/app/dataNotes';
import Bin from '../icons/Bin';
import Folder from '../icons/Folder';
import Sidebar from '../icons/Sidebar';

const Leftbar = () => {

  const totalNotes = dataNotes.length
  const totalDeleteNotes = dataDeleteNotes.length

  return (
    <div className="w-1/4 h-full bg-gray p-4 flex flex-col gap-8">
      <div className="nav-leftbar flex flex-row gap-2 items-center">
        <div className="bg-[#FF5F57] h-3 w-3 rounded-full"></div>
        <div className="bg-[#FFBD2F] h-3 w-3 rounded-full"></div>
        <div className="bg-[#28C840] h-3 w-3 rounded-full mr-2"></div>
        <div className="h-7 w-8 flex items-center justify-center bg-transparent hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300">
          <Sidebar />
        </div>

      </div>
      <div className="notes">
        <h6 className="font-bold text-grayDark pb-[5px]">iCloud</h6>
        <ul>
          <li className="flex flex-row justify-between w-full px-3 py-2 bg-yellowDark rounded-lg">
            <div className="flex flex-row gap-2 items-center">
              <Folder />
              <p className="font-semibold text-white">Notes</p>
            </div>
            <p className="font-semibold text-white">{totalNotes}</p>
          </li>
          <li className="flex flex-row justify-between w-full px-3 py-2 rounded-lg">
            <div className="flex flex-row gap-2 items-center">
              <Bin />
              <p className="font-semibold text-text">Suppr. récentes</p>
            </div>
            <p className="font-semibold text-grayOpacity">{totalDeleteNotes}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;