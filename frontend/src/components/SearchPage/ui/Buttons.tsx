import { BsPersonFillAdd } from "react-icons/bs";
import { BsCloudUploadFill } from "react-icons/bs";
import { BsCloudDownloadFill } from "react-icons/bs";
import { BsFilter } from "react-icons/bs";

const buttonStyle = 'flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600'

export const BttAddEmployee = ({ onClick }) => {
  return <button 
    className={buttonStyle}
    onClick={onClick}>
      <BsPersonFillAdd/>Add Employee
    </button>
}

export const BttImport = ({ onClick }) => {
  return <button 
    className={buttonStyle}
    onClick={onClick}>
      <BsCloudUploadFill/>Import
    </button>
}

export const BttExport = ({ onClick }) => {
  return <button
    className={buttonStyle}
    onClick={ onClick }>
      <BsCloudDownloadFill/>Export
    </button>
}

export const BttFilter = ({ onClick }) => {
  return <button className={buttonStyle}
      onClick={onClick}>
        <BsFilter/>Filter
      </button>
}