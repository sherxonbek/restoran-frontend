import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputAuth from "@/components/ui/InputAuth";
import { setCurrentUser } from "@/store/slices/userSlice";
import { LogIn, AlertCircle } from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users = [] } = useSelector((state) => state.users);

  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tel: "",
    password: "",
  });

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 9);
    let formatted = "";

    if (numbers.length > 0) {
      formatted = numbers.slice(0, 2);
    }
    if (numbers.length > 2) {
      formatted += " " + numbers.slice(2, 5);
    }
    if (numbers.length > 5) {
      formatted += " " + numbers.slice(5, 7);
    }
    if (numbers.length > 7) {
      formatted += " " + numbers.slice(7, 9);
    }

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg("");

    if (name === "tel") {
      const formattedTel = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        tel: formattedTel,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const cleanInputPhone = "998" + formData.tel.replace(/\D/g, "");
    const inputPassword = formData.password.trim();

    if (cleanInputPhone.length < 12) {
      setErrorMsg("Iltimos, telefon raqamni to'liq kiriting!");
      setLoading(false);
      return;
    }

    // 1. Bazadagi xodimlar orasidan qidirish
    const foundUser = users.find((u) => {
      const userPhone = String(u.phone || "").replace(/\D/g, "");
      const userPassword = String(u.password || "").trim();
      return userPhone === cleanInputPhone && userPassword === inputPassword;
    });

    // 2. Agar topilsa:
    if (foundUser) {
      dispatch(setCurrentUser(foundUser));
      setLoading(false);

      const role = String(foundUser.role || "").trim().toLowerCase();
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "ofitsiant") {
        navigate("/ofitsiant", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      return;
    }

    // 3. Standart dastlabki admin zaxirasi (agar bazada hali admin bo'lmasa)
    if (
      (cleanInputPhone === "998901234567" || cleanInputPhone === "998999999999") &&
      inputPassword === "admin"
    ) {
      const defaultAdmin = {
        id: "default-admin",
        fullName: "Bosh Admin",
        phone: "+998 90 123 45 67",
        role: "Admin",
      };
      dispatch(setCurrentUser(defaultAdmin));
      setLoading(false);
      navigate("/admin", { replace: true });
      return;
    }

    // 4. Hech qaysi mos kelmasa -> xatolik
    setLoading(false);
    setErrorMsg("Telefon raqam yoki parol noto'g'ri!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 text-white">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
            <LogIn size={26} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Tizimga Kirish</h1>
          <p className="text-xs text-slate-400">Xodim telefon raqami va parolingizni kiriting</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Telefon raqam input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-tel" className="text-xs font-semibold text-slate-300">
              Telefon raqam *
            </label>
            <div className="flex items-center border border-slate-700/80 rounded-xl px-3.5 py-2.5 bg-slate-950/60 focus-within:border-indigo-500 transition-colors">
              <span className="text-slate-400 text-sm mr-2 font-mono select-none">+998</span>
              <input
                id="login-tel"
                type="text"
                name="tel"
                placeholder="90 123 45 67"
                onChange={handleChange}
                value={formData.tel}
                maxLength={12}
                required
                autoComplete="tel"
                className="outline-none text-sm bg-transparent w-full text-white placeholder:text-slate-600 font-mono"
              />
            </div>
          </div>

          {/* Parol input */}
          <InputAuth
            type={showPass ? "text" : "password"}
            name="password"
            lable="Parol *"
            onChange={handleChange}
            value={formData.password}
            showPassword={showPass}
            onToggleShow={() => setShowPass((prev) => !prev)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;