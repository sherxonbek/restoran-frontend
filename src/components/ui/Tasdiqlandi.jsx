import { CircleCheck } from "lucide-react"

function Tasdiqlandi({pr}) {
  return (
    <div
    className="w-full flex gap-2 items-center bg-green-500 p-4 font-extrabold text-xl rounded my-2"
    ><CircleCheck size={26}/> {pr}</div>
  )
}

export default Tasdiqlandi