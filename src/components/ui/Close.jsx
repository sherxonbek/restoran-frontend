import { Link } from "react-router-dom"

function Close( { to } ) {
  return (
    <Link
    to={to}
    className="text-2xl font-extrabold text-red-500 w-10 h-10 flex justify-center items-center hover:bg-red-500 hover:text-white transition-all duration-300"
    >X</Link>
  )
}

export default Close