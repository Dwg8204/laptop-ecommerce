import { create } from "../../../backend/models/authAdmin"; 
import { createContext, useState, useEffect } from "react";

const AdminStaffContext = createContext();

export function AdminStaffProvider({ children }) {
  const [staffList, setStaffList] = useState([]);
  
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/staff");
        const data = await res.json();
        if (res.ok) {
          setStaffList(data);
        } else {
          console.error("Failed to fetch staff list:", data.message);
        }
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };

    fetchStaffList();
  }, []);

  return (
    <AdminStaffContext.Provider value={{ staffList, setStaffList }}>
      {children}
    </AdminStaffContext.Provider>
  );
}

export const useAdminStaff = () => useContext(AdminStaffContext);