export const Button = ({disabled, label, onClick}) => {
  return (
    <button
        type="submit"
        disabled={disabled}
        onClick={onClick}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {label}
      </button>
  )
}