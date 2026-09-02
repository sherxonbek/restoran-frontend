import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { db } from "@/server/firebase"; 
import { collection, onSnapshot } from "firebase/firestore";
import { setProductsRealTime } from "@/server/Slice/productSlice";
import { setRoomsRealTime, setTablesRealTime } from "@/server/Slice/roomSlice";

export function useRealTimeData() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setProductsRealTime(list));
    });

    const unsubRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setRoomsRealTime(list.reverse()));
    });

    const unsubTables = onSnapshot(collection(db, "tables"), (snapshot) => {
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setTablesRealTime(list.reverse()));
    });

    return () => {
      unsubProducts();
      unsubRooms();
      unsubTables();
    };
  }, [dispatch]);
}
