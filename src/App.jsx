import { useDispatch } from "react-redux";
import router from "./components/navigation/navigate";
import { RouterProvider } from 'react-router-dom';
import { useEffect } from "react";
import { fetchUsers } from "./server/Slice/userSlice";
import { getRoom } from "./server/Slice/roomSlice";

function App() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(getRoom())
  },[])

  return (
    <div>
      <div
        style={{ backgroundImage: `url('/assets/bg-image.jpg')` }}
        className="flex h-screen w-screen overflow-hidden bg-cover bg-center font-sans antialiased relative"
      >
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md z-0 pointer-events-none" />

        <div className="relative z-10 flex-1 flex h-full w-full">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  )
}

export default App