import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LogIn, ArrowRight } from "lucide-react";

export default function HomeGreeting() {
  const { currentUser } = useSelector((state) => state.users);

  const user = currentUser || (() => {
    try {
      const saved = localStorage.getItem("current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const userRole = String(user?.role || "").trim().toLowerCase();
  const dashboardLink = userRole === "admin" ? "/admin" : userRole === "ofitsiant" ? "/ofitsiant" : "/auth/login";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center px-4">
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 shadow-2xl max-w-md w-full space-y-5">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Salom!
        </h1>
        <p className="text-sm text-slate-400">
          Restoran boshqaruv tizimiga xush kelibsiz.
        </p>

        <div className="pt-2">
          {user ? (
            <Link
              to={dashboardLink}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <span>{user.role} paneliga o'tish</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              to="/auth/login"
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <LogIn size={16} />
              <span>Tizimga Kirish</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
