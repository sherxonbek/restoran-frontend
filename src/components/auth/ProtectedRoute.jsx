import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.users);

  // Redux yoki localStorage dan foydalanuvchini olish
  const user = currentUser || (() => {
    try {
      const saved = localStorage.getItem("current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // 1. Agar foydalanuvchi tizimga kirmagan bo'lsa -> Login sahifasiga
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 2. Agar rollar cheklangan bo'lsa va foydalanuvchi roli mos kelmasa
  if (allowedRoles.length > 0) {
    const userRole = String(user.role || "").trim().toLowerCase();
    const hasRole = allowedRoles.some(
      (role) => role.trim().toLowerCase() === userRole
    );

    if (!hasRole) {
      // Foydalanuvchini o'zining ruxsat berilgan bo'limiga yo'naltirish
      if (userRole === "admin") {
        return <Navigate to="/admin" replace />;
      }
      if (userRole === "ofitsiant") {
        return <Navigate to="/ofitsiant" replace />;
      }
      return <Navigate to="/auth/login" replace />;
    }
  }

  return children;
}
