"use client";
import React from 'react';
import { dataNotes, dataDeleteNotes} from '@/app/dataNotes';
import Trash from '../icons/Trash';
import Folder from '../icons/Folder';
import Sidebar from '../icons/Sidebar';
import IconHoverContainer from '../IconHoverContainer';

const Leftbar = () => {

  const totalNotes = dataNotes.length
  const totalDeleteNotes = dataDeleteNotes.length

  return (
    <div className="w-1/4 h-full bg-gray p-4 flex flex-col gap-8">
      <div className="nav-leftbar flex flex-row gap-2 items-center">
        <div className="bg-[#FF5F57] h-3 w-3 rounded-full"></div>
        <div className="bg-[#FFBD2F] h-3 w-3 rounded-full"></div>
        <div className="bg-[#28C840] h-3 w-3 rounded-full mr-2"></div>
        <IconHoverContainer>
          <Sidebar />
        </IconHoverContainer>

      </div>
      <div className="notes">
        <h6 className="font-bold text-grayDark pb-[5px]">iCloud</h6>
        <ul>
          <li className="flex flex-row justify-between w-full px-3 py-1 bg-yellowDark rounded-lg">
            <div className="flex flex-row gap-2 items-center">
              <Folder color="#6F6F6F" />
              <p className="font-semibold text-white">Notes</p>
            </div>
            <p className="font-semibold text-white">{totalNotes}</p>
          </li>
          <li className="flex flex-row justify-between w-full px-3 py-2 rounded-lg">
            <div className="flex flex-row gap-2 items-center">
              <Trash color="#DC9F3A" height="18" width="18" />
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