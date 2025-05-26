import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";

const AttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [mergedAttendance, setMergedAttendance] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchEmployees = async () => {
    try {
      const snapshot = await getDocs(collection(db, "employees"));
      const empList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(empList);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendanceForDate = async (dateStr) => {
    try {
      const formattedDate = dateStr.split("-").reverse().join("-");
      const q = query(collection(db, "attendance"), where("date", "==", formattedDate));
      const snapshot = await getDocs(q);
      const attendance = snapshot.docs.map(doc => doc.data());
      setAttendanceData(attendance);

      const merged = employees.map(emp => {
        const record = attendance.find(a => a.empId === emp.id);
        return {
          name: emp.name,
          status: record ? record.status : "Absent"
        };
      });
      setMergedAttendance(merged);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    
    <div style={{ padding: "20px" }}>
     <Sidebar />
      <h2>Attendance Status - {selectedDate}</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px" }}
      />

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Status (Present / Half Day / Absent)</th>
          </tr>
        </thead>
        <tbody>
          {mergedAttendance.map((emp, idx) => (
            <tr key={idx}>
              <td>{emp.name}</td>
              <td>{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceReport;
