import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import './Trackabi.css';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";

const Trackabi = () => {
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchClickupStatus();
    }
  }, [selectedDate, employees.length]);

  const fetchEmployees = async () => {
    const snapshot = await getDocs(collection(db, "employees"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      status: "", // Initial empty status
      isDisabled: false, // Initially enabled
    }));
    setEmployees(data);
  };

  const fetchClickupStatus = async () => {
    const formattedDate = selectedDate.split("-").reverse().join("-");
    const updatedEmployees = await Promise.all(
      employees.map(async (emp) => {
        const dailyDocId = `${emp.id}_${formattedDate}`;
        const clickupRef = doc(db, "trackabi", dailyDocId);
        const snap = await getDoc(clickupRef);
        return {
          ...emp,
          status: snap.exists() ? snap.data().status : "",
          isDisabled: snap.exists(), // Disable if status already saved
        };
      })
    );
    setEmployees(updatedEmployees);
  };

  const handleCheckboxChange = async (id, value) => {
    try {
      setSaving(id);
      const selectedEmp = employees.find((emp) => emp.id === id);
      const currentDateFormatted = selectedDate.split("-").reverse().join("-");
      const dailyDocId = `${id}_${currentDateFormatted}`;

      await setDoc(doc(db, "trackabi", dailyDocId), {
        name: selectedEmp.name,
        designation: selectedEmp.designation,
        status: value ? "yes" : "no",
        date: currentDateFormatted,
      });

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id
            ? { ...emp, status: value ? "yes" : "no", isDisabled: true }
            : emp
        )
      );
    } catch (error) {
      console.error("Error updating clickup collection:", error);
    } finally {
      setSaving(null);
    }
  };

  const totalCompleted = employees.filter((emp) => emp.status === "yes").length;
  const totalIncomplete = employees.filter((emp) => emp.status === "no").length;

  return (
    <div className="clickup-container">
      <div className="clickup-sidebar">
        <Sidebar />
      </div>

      <div className="clickup-main">
        <h2 className="clickup-heading">Employee Trackabi Status</h2>

        <div className="clickup-widgets">
          <div className="clickup-widget">
            <h4>Total Employees</h4>
            <p>{employees.length}</p>
          </div>
          <div className="clickup-widget">
            <h4>Completed</h4>
            <p>{totalCompleted}</p>
          </div>
          <div className="clickup-widget">
            <h4>Incomplete</h4>
            <p>{totalIncomplete}</p>
          </div>
          <div className="clickup-widget">
            <h4>Select Date</h4>
            <input
  type="date"
  value={selectedDate}
  disabled
/>

          </div>
          <div className="clickup-widget clickup-logo-widget">
            <img
              src="https://trackabi.com/img/front/press-kit/Trackabi-Logo-Square.svg"
              alt="ClickUp Logo"
              style={{ width: "100px", marginTop: "10px" }}
            />
          </div>
        </div>

        <table className="clickup-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.designation}</td>
                <td>
                  <select
                    value={emp.status}
                    onChange={(e) =>
                      handleCheckboxChange(emp.id, e.target.value === "yes")
                    }
                    disabled={saving === emp.id || emp.isDisabled}
                    className="clickup-dropdown"
                  >
                    <option value="">Select Status</option>
                    <option value="yes">Completed</option>
                    <option value="no">Incomplete</option>
                    <option value="leave">Leave</option>
                  </select>
                  {saving === emp.id && (
                    <span className="clickup-saving-text">Saving...</span>
                  )}
                </td>
                <td>{selectedDate.split("-").reverse().join("-")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trackabi;
