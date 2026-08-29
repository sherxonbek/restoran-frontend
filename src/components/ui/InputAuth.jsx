import { Eye, EyeOff } from "lucide-react"

function InputAuth({ type, name, lable, showPassword, onToggleShow, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name}>{lable}</label>
            <div className="flex items-center border rounded-xl p-3 text-xl bg-transparent">
                <input 
                    type={type} 
                    id={name} 
                    value={value}
                    onChange={onChange}
                    name={name} 
                    required 
                    className="outline-none text-xl bg-transparent w-full" 
                />
                {onToggleShow && (
                    <button type="button" onClick={onToggleShow} className="ml-2">
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                )}
            </div>
        </div>
    )
}

export default InputAuth