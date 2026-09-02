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
import Stollar from "@/pages/admin/Stollar";
import MaxsulotDetallari from "@/pages/admin/Sozlamalar/MaxsulotDetallari";
import Homes from "@/pages/Ofitsiant/Home"
import OfLayout from "./OfLayout";
import OfitsiantBuyurtma from "@/pages/Ofitsiant/OfitsiantBuyurtma";

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
        path: 'admin/xonalar/:roomId',
        element: <Stollar navg={'/admin/xonalar'} />
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
      {
        path: 'admin/maxsulotlar/:productId',
        element: <MaxsulotDetallari />
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
  },
  //afitsant pages navigator
  {
    path: 'ofitsiant/',
    element: <OfLayout />,
    children: [
      {
        index: true,
        element: <Homes />
      },
      {
        path: 'xona/:roomId',
        element: <Stollar navg={'/ofitsiant'} />
      },
      {
        path: 'buyurtma/xona/:roomId/stol/:tableId', // Xona va Stol ID birga keladi
        element: <OfitsiantBuyurtma />
      }
    ]
  },
]);

export default router;