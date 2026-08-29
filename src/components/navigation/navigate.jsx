import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import { Suspense } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import Xodimlar from "@/pages/admin/Xodimlar";
import Xonalar from "@/pages/admin/Xonalar";
import Statistika from "@/pages/admin/Statistika";
import Sozlamalar from "@/pages/admin/Sozlamalar";
import Maxsulotlar from "@/pages/admin/Sozlamalar/Maxsulotlar";
import Login from "@/pages/auth/Login";
import Home from "@/pages/admin/Home";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'admin/xodimlar',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Xodimlar />
          </Suspense>
        )
      },
      {
        path: 'admin/xonalar',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Xonalar />
          </Suspense>
        )
      },
      {
        path: 'admin/statistika',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Statistika />
          </Suspense>
        )
      },
      {
        path: 'admin/sozlamalar',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Sozlamalar />
          </Suspense>
        )
      },
      {
        path: 'admin/sozlamalar/maxsulotlar',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Maxsulotlar />
          </Suspense>
        )
      },
    ],
  },
  {
    path: '/auth/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  }
]);

export default router;