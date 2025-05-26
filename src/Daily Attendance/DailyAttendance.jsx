import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import "./DailyAttendance.css";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DailyAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [timeInputs, setTimeInputs] = useState({});
  const [savedAttendance, setSavedAttendance] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendanceStatus();
    }
  }, [selectedDate, employees.length]);

  const fetchEmployees = async () => {
    const snapshot = await getDocs(collection(db, "employees"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(data);
  };

  const fetchAttendanceStatus = async () => {
    const formattedDate = selectedDate.split("-").reverse().join("-");
    const updatedEmployees = await Promise.all(
      employees.map(async (emp) => {
        const docId = `${emp.id}_${formattedDate}`;
        const ref = doc(db, "attendance", docId);
        const snap = await getDoc(ref);

        return {
          ...emp,
          status: snap.exists() ? snap.data().status : "", // Default to empty string
          entryTime: snap.exists() ? snap.data().entryTime || "" : "",
          leavingTime: snap.exists() ? snap.data().leavingTime || "" : "",
        };
      })
    );

    setEmployees(updatedEmployees);

    const inputs = {};
    const saved = {};
    updatedEmployees.forEach((emp) => {
      inputs[emp.id] = {
        entryTime: emp.entryTime,
        leavingTime: emp.leavingTime,
      };
      if (emp.status) {
        saved[emp.id] = true;
      }
    });

    setTimeInputs(inputs);
    setSavedAttendance(saved);
  };

  const handleAttendanceChange = async (id, name, status) => {
    if (savedAttendance[id]) return;

    const formattedDate = selectedDate.split("-").reverse().join("-");
    const docId = `${id}_${formattedDate}`;
    const ref = doc(db, "attendance", docId);

    let entryTime = "";
    let leavingTime = "";

    if (status !== "Absent" && status !== "") {
      const existing = await getDoc(ref);
      entryTime = existing.exists()
        ? existing.data().entryTime || new Date().toLocaleTimeString("en-IN", { hour12: false }).slice(0, 5)
        : new Date().toLocaleTimeString("en-IN", { hour12: false }).slice(0, 5);
      leavingTime = existing.exists() ? existing.data().leavingTime || "" : "";
    }

    setTimeInputs((prev) => ({
      ...prev,
      [id]: { entryTime, leavingTime },
    }));

    const data = {
      employeeId: id,
      name,
      status,
      date: formattedDate,
      entryTime,
      leavingTime,
    };

    await setDoc(ref, data);

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, ...data } : emp
      )
    );
  };

  const handleTimeChange = (id, field, value) => {
    if (savedAttendance[id]) return;

    setTimeInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleManualTimeSave = async (id, name) => {
    if (savedAttendance[id]) return;

    const formattedDate = selectedDate.split("-").reverse().join("-");
    const docId = `${id}_${formattedDate}`;
    const ref = doc(db, "attendance", docId);

    const data = {
      employeeId: id,
      name,
      status: employees.find((e) => e.id === id)?.status || "Absent",
      date: formattedDate,
      entryTime: timeInputs[id]?.entryTime || "",
      leavingTime: timeInputs[id]?.leavingTime || "",
    };

    await setDoc(ref, data);

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, ...data } : emp
      )
    );

    setSavedAttendance((prev) => ({
      ...prev,
      [id]: true,
    }));

    toast.success(`Attendance saved for ${name}`);
  };

  return (
    <div className="attendance-container">
      <div className="attendance-sidebar">
        <Sidebar />
      </div>
      <div className="attendance-main">
        <h2 className="attendance-heading">Employee Attendance</h2>

        <div className="attendance-widgets">
          <div className="attendance-widget">
            <h4>Today Date</h4>
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              disabled
            />
          </div>
        </div>

        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Employment Type</th>
                <th>Attendance</th>
                <th>Entry Time</th>
                <th>Leaving Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{selectedDate.split("-").reverse().join("-")}</td>
                  <td>{emp.name}</td>
                  <td>{emp.employmentType}</td>
                  <td>
                    <select
                      value={emp.status || ""}
                      onChange={(e) =>
                        handleAttendanceChange(emp.id, emp.name, e.target.value)
                      }
                      disabled={savedAttendance[emp.id]}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Half Day">Half Day</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="time"
                      value={timeInputs[emp.id]?.entryTime || ""}
                      onChange={(e) =>
                        handleTimeChange(emp.id, "entryTime", e.target.value)
                      }
                      disabled={
                        emp.status === "Absent" ||
                        emp.status === "" ||
                        savedAttendance[emp.id]
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={timeInputs[emp.id]?.leavingTime || ""}
                      onChange={(e) =>
                        handleTimeChange(emp.id, "leavingTime", e.target.value)
                      }
                      disabled={
                        emp.status === "Absent" ||
                        emp.status === "" ||
                        savedAttendance[emp.id]
                      }
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleManualTimeSave(emp.id, emp.name)}
                      className="attendance-save-button"
                      disabled={savedAttendance[emp.id]}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default DailyAttendance;
