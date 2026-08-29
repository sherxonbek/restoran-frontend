import InputAuth from "@/components/ui/InputAuth"
import { useState } from "react"

function Login() {
    const [showPass, setShowPass] = useState(false)

    const [formData, setFormData] = useState({
        tel: "",
        password: "",
    })

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, "").slice(0, 9)
        
        let formatted = ""

        if (numbers.length > 0) {
            formatted = numbers.slice(0, 2) 
        }
        if (numbers.length > 2) {
            formatted += " " + numbers.slice(2, 5)
        }
        if (numbers.length > 5) {
            formatted += " " + numbers.slice(5, 7) 
        }
        if (numbers.length > 7) {
            formatted += " " + numbers.slice(7, 9) 
        }

        return formatted
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === "tel") {
            const formattedTel = formatPhoneNumber(value)
            setFormData(prev => ({
                ...prev,
                tel: formattedTel
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const rawTel = "+998" + formData.tel.replace(/\s/g, "")
        console.log("Yuborilayotgan ma'lumotlar:", { ...formData, tel: rawTel })
    }

    return (
        <div className="max-w-sm flex justify-center items-center m-auto rounded-2xl text-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm m-auto bg-gray-700/60 rounded shadow p-6 w-full">

                {/* Telefon raqam uchun maxsus input dizayni */}
                <div className="flex flex-col gap-2">
                    <label>Telefon raqam *</label>
                    <div className="flex items-center border rounded-xl p-3 text-xl bg-transparent">
                        <span className="text-gray-400 mr-2">+998</span>
                        <input
                            type="text" 
                            name="tel"
                            placeholder="91 234 56 78"
                            onChange={handleChange}
                            value={formData.tel}
                            maxLength={12}
                            className="outline-none text-xl bg-transparent w-full text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <InputAuth
                    type={showPass ? "text" : "password"}
                    name="password"
                    lable="Parol *"
                    onChange={handleChange}
                    value={formData.password}
                    showPassword={showPass}
                    onToggleShow={() => setShowPass(prev => !prev)}
                />

                <button type="submit" className="bg-blue-600 p-3 rounded-xl text-white font-semibold mt-2">
                    Kirish
                </button>
            </form>
        </div>
    )
}

export default Login