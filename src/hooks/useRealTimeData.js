import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { db } from "@/services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { setProductsRealTime } from "@/store/slices/productSlice";
import { setRoomsRealTime, setTablesRealTime } from "@/store/slices/roomSlice";
import { setOrdersRealTime } from "@/store/slices/orderSlice";
import { setUsersRealTime } from "@/store/slices/userSlice";
import {
  setInventoryRealTime,
  setInventoryHistoryRealTime,
} from "@/store/slices/inventorySlice";

export function useRealTimeData() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setProductsRealTime(list));
    });

    const unsubRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setRoomsRealTime(list.reverse()));
    });

    const unsubTables = onSnapshot(collection(db, "tables"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setTablesRealTime(list.reverse()));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setOrdersRealTime(list));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setUsersRealTime(list));
    });

    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      dispatch(setInventoryRealTime(list));
    });

    const unsubInventoryHistory = onSnapshot(
      collection(db, "inventory_history"),
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        dispatch(setInventoryHistoryRealTime(list));
      }
    );

    return () => {
      unsubProducts();
      unsubRooms();
      unsubTables();
      unsubOrders();
      unsubUsers();
      unsubInventory();
      unsubInventoryHistory();
    };
  }, [dispatch]);
}
