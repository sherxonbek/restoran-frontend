import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/navigation/MainLayout";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Xodimlar from "@/pages/admin/Xodimlar";
import Xonalar from "@/pages/admin/Xonalar";
import Statistika from "@/pages/admin/Statistika";
import Sozlamalar from "@/pages/admin/Sozlamalar";
import Maxsulotlar from "@/pages/admin/Sozlamalar/Maxsulotlar";
import Login from "@/pages/auth/Login";
import Home from "@/pages/admin/Home";
import Stollar from "@/pages/admin/Stollar";
import MaxsulotDetallari from "@/pages/admin/Sozlamalar/MaxsulotDetallari";
import Ombor from "@/pages/admin/Ombor";
import Homes from "@/pages/ofitsiant/Home";
import OfitsiantLayout from "@/components/navigation/OfitsiantLayout";
import OfitsiantBuyurtma from "@/pages/ofitsiant/OfitsiantBuyurtma";
import Buyurtmalar from "@/pages/ofitsiant/Buyurtmalar";
import HomeGreeting from "@/pages/HomeGreeting";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OshpazHome from "@/pages/oshpaz/OshpazHome";

const router = createBrowserRouter([
  // 1. Asosiy ildiz marshruti - vaqtinchalik Salom
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HomeGreeting />
      </Suspense>
    ),
  },

  // 2. Tizimga kirish (Login)
  {
    path: "/auth/login",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  },

  // 3. Admin marshrutlari (/admin/...) - faqat adminlar uchun
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "xodimlar",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Xodimlar />
          </Suspense>
        ),
      },
      {
        path: "xonalar",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Xonalar />
          </Suspense>
        ),
      },
      {
        path: "xonalar/:roomId",
        element: <Stollar navg={"/admin/xonalar"} />,
      },
      {
        path: "statistika",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Statistika />
          </Suspense>
        ),
      },
      {
        path: "sozlamalar",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Sozlamalar />
          </Suspense>
        ),
      },
      {
        path: "sozlamalar/maxsulotlar",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Maxsulotlar />
          </Suspense>
        ),
      },
      {
        path: "ombor",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Ombor />
          </Suspense>
        ),
      },
      {
        path: "maxsulotlar/:productId",
        element: <MaxsulotDetallari />,
      },
    ],
  },

  // 4. Ofitsiant marshrutlari (/ofitsiant/...) - ofitsiant va admin uchun
  {
    path: "/ofitsiant",
    element: (
      <ProtectedRoute allowedRoles={["ofitsiant", "admin"]}>
        <OfitsiantLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Homes />,
      },
      {
        path: "xona/:roomId",
        element: <Stollar navg={"/ofitsiant"} />,
      },
      {
        path: "buyurtma/xona/:roomId/stol/:tableId",
        element: <OfitsiantBuyurtma />,
      },
      {
        path: "buyurtmalar",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Buyurtmalar />
          </Suspense>
        ),
      },
    ],
  },

  // 5. Oshpaz marshruti (/oshpaz) - oshpaz va admin uchun
  {
    path: "/oshpaz",
    element: (
      <ProtectedRoute allowedRoles={["oshpaz", "admin"]}>
        <Suspense fallback={<LoadingSpinner />}>
          <OshpazHome />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);

export default router;