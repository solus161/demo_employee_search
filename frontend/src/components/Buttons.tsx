import React from 'react'
import { BsPersonFillAdd } from "react-icons/bs";
import { BsCloudUploadFill } from "react-icons/bs";
import { BsCloudDownloadFill } from "react-icons/bs";
import { BsFilter } from "react-icons/bs";

export const ButtonBasic = ({ customClass, callbackFn, label }) => (
  <button className={customClass} onClick={callbackFn}>
    {label}
  </button>
)

const buttonStyle = 'flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600'
export const BttAddEmployee = ({ callbackFn }) => {
    return <button 
      className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2'
      onClick={callbackFn}>
        <BsPersonFillAdd/>Add Employee
      </button>
}

export const BttImport = ({ callbackFn }) => {
    return <button 
      className={buttonStyle}
      onClick={callbackFn}>
        <BsCloudUploadFill/>Import
      </button>
}

export const BttExport = ({ callbackFn }) => {
    return <button className={buttonStyle}
      onClick={callbackFn}>
        <BsCloudDownloadFill/>Export
      </button>
}

export const BttFilter = ({ callbackFn }) => {
  return <button className={buttonStyle}
      onClick={callbackFn}>
        <BsFilter/>Filter
      </button>
}