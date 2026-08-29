import { useState } from "react"
import InputAuth from "@/components/ui/InputAuth"

function Register() {
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Yuborilayotgan ma'lumotlar:", formData)
    }

    return (
        <div className="max-w-sm flex justify-center items-center m-auto rounded-2xl text-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm m-auto bg-gray-700/60 rounded shadow p-6 w-full">
                
                <InputAuth 
                type="number" 
                name="tel" 
                lable="Telefon raqam" 
                onChange={handleChange}
                value={formData.username}
                />

                

                <InputAuth 
                    type={showPass ? "text" : "password"} 
                    name="password" 
                    lable="Password"
                    onChange={handleChange}
                    value={formData.password} 
                    showPassword={showPass}
                    onToggleShow={() => setShowPass(prev => !prev)}
                />

                <button type="submit" className="bg-blue-600 p-3 rounded-xl text-white font-semibold mt-2">
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register