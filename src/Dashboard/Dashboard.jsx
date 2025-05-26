  import React, { useEffect, useState } from "react";
  import Sidebar from "../Sidebar/Sidebar";
  import "./Dashboard.css";
  import backgroundImage from "../assets/allbg.jpg";
  import { db } from "../firebase";
  import { collection, getDocs, query, where } from "firebase/firestore";
  import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from "recharts";

  const Dashboard = () => {
    const [attendanceTableData, setAttendanceTableData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    });
 const [employeeMonthlyChartData, setEmployeeMonthlyChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    // Format yyyy-mm
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
    const [clickupYesCount, setClickupYesCount] = useState(0);
    const [clickupNoCount, setClickupNoCount] = useState(0);
    const [trackabiYesCount, setTrackabiYesCount] = useState(0);
    const [trackabiNoCount, setTrackabiNoCount] = useState(0);
    const [workdoneYesCount, setWorkdoneYesCount] = useState(0);
    const [workdoneNoCount, setWorkdoneNoCount] = useState(0);
    const [totalEmployeesCount, setTotalEmployeesCount] = useState(0);

  const CircleProgressBar = ({ label, value, maxValue }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / maxValue) * circumference;

  return (
    <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx="70"
        cy="70"
        r={radius}
        stroke="#eee"
        strokeWidth="15"
        fill="none"
      />
      <circle
        cx="70"
        cy="70"
        r={radius}
        stroke="#00796b"
        strokeWidth="15"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
      />
      <text
        x="70"
        y="80"
        textAnchor="middle"
        fontSize="18"
        fill="#00796b"
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {label}
      </text>
      <text
        x="70"
        y="105"
        textAnchor="middle"
        fontSize="22"
        fill="#00796b"
        fontWeight="bold"
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {value.toFixed(1)}h
      </text>
    </svg>
  );
};
const maxEmployee = employeeMonthlyChartData.reduce(
  (max, emp) => (emp.totalHours > max.totalHours ? emp : max),
  { name: "", totalHours: 0 }
);


 const timeStrToDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  // calculate duration in decimal hours between entryTime and leavingTime
  const calculateTotalHours = (entryTime, leavingTime) => {
  if (!entryTime || !leavingTime) return "0.00";

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return new Date(0, 0, 0, hours, minutes);
  };

  const start = parseTime(entryTime);
  const end = parseTime(leavingTime);
  let diffMs = end - start;

  if (diffMs < 0) diffMs = 0; // prevent negative values

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${diffHrs}.${diffMins.toString().padStart(2, "0")}`;
};


  // Fetch monthly total hours per employee
  const fetchMonthlyEmployeeHours = async (month) => {
    try {
      // Get all attendance records
      const snapshot = await getDocs(collection(db, "attendance"));

      // month is in 'YYYY-MM' format, e.g. '2025-05'
      // We'll check the date field (format assumed "DD-MM-YYYY" or similar) for matching month and year
      // Adjust this if your date format differs.

      const monthlyTotals = {}; // { employeeName: totalHours }

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const dateParts = data.date?.split("-"); // e.g. ["DD","MM","YYYY"]
        if (!dateParts || dateParts.length < 3) return;

        const recordMonthYear = `${dateParts[2]}-${dateParts[1]}`; // "YYYY-MM"
        if (recordMonthYear === month) {
          const name = data.name || "Unknown";
          const hours = calculateTotalHours(data.entryTime, data.leavingTime);

          monthlyTotals[name] = (monthlyTotals[name] || 0) + hours;
        }
      });

      // Convert to array for recharts
      const chartArray = Object.entries(monthlyTotals).map(([name, totalHours]) => ({
        name,
        totalHours: Number(totalHours.toFixed(2)), // keep 2 decimals
      }));

      setEmployeeMonthlyChartData(chartArray);
    } catch (error) {
      console.error("Error fetching monthly employee hours:", error);
    }
  };

  // Call monthly fetch when selectedMonth changes
  useEffect(() => {
    fetchMonthlyEmployeeHours(selectedMonth);
  }, [selectedMonth]);
    const fetchAttendance = async (dateStr) => {
      try {
        const formattedDate = dateStr.split("-").reverse().join("-");
        const q = query(collection(db, "attendance"), where("date", "==", formattedDate));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const record = doc.data();
          const totalHours = calculateTotalHours(record.entryTime, record.leavingTime);
          return { ...record, totalHours };
        });
        setAttendanceTableData(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    const fetchTotalEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"));
        setTotalEmployeesCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching total employees:", error);
      }
    };

    const fetchClickupStatus = async (dateStr) => {
      try {
        const formattedDate = dateStr.split("-").reverse().join("-");
        const q = query(collection(db, "clickup"), where("date", "==", formattedDate));
        const querySnapshot = await getDocs(q);
        let yes = 0;
        let no = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "yes") yes++;
          else if (data.status === "no") no++;
        });
        setClickupYesCount(yes);
        setClickupNoCount(no);
      } catch (error) {
        console.error("Error fetching ClickUp status:", error);
      }
    };

    const fetchTrackabiStatus = async (dateStr) => {
      try {
        const formattedDate = dateStr.split("-").reverse().join("-");
        const q = query(collection(db, "trackabi"), where("date", "==", formattedDate));
        const querySnapshot = await getDocs(q);
        let yes = 0;
        let no = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "yes") yes++;
          else if (data.status === "no") no++;
        });
        setTrackabiYesCount(yes);
        setTrackabiNoCount(no);
      } catch (error) {
        console.error("Error fetching Trackabi status:", error);
      }
    };

    const fetchWorkdoneStatus = async (dateStr) => {
      try {
        const formattedDate = dateStr.split("-").reverse().join("-");
        const q = query(collection(db, "workdone"), where("date", "==", formattedDate));
        const querySnapshot = await getDocs(q);
        let yes = 0;
        let no = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "yes") yes++;
          else if (data.status === "no") no++;
        });
        setWorkdoneYesCount(yes);
        setWorkdoneNoCount(no);
      } catch (error) {
        console.error("Error fetching Workdone status:", error);
      }
    };

    useEffect(() => {
      fetchAttendance(selectedDate);
      fetchClickupStatus(selectedDate);
      fetchTrackabiStatus(selectedDate);
      fetchWorkdoneStatus(selectedDate);
      fetchTotalEmployees();
    }, [selectedDate]);

     const presentCount = attendanceTableData.filter(
    (record) => record.status === "Present"
  ).length;

  const halfDayCount = attendanceTableData.filter(
    (record) => record.status === "Half Day"
  ).length;

  const absentCount = totalEmployeesCount - presentCount - halfDayCount;

  const tardyCount = attendanceTableData.filter(
    (record) => record.status === "Tardy"
  ).length;


    const cardData = [
      {
        id: 1,
        title: "Click Up",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJrSxyKnMBdmFOrMr6qTrkGwWB0rP5oa2V0w&s",
        completed: clickupYesCount,
        incomplete: clickupNoCount,
        
      },
      {
        id: 2,
        title: "Trackabi Timer",
        imageUrl: "https://trackabi.com/img/front/press-kit/Trackabi-Logo-Square.svg",
        completed: trackabiYesCount,
        incomplete: trackabiNoCount,
      },
      {
        id: 3,
        title: "Workdone",
        imageUrl: "https://img.freepik.com/premium-vector/google-sheets-logo_578229-309.jpg",
        completed: workdoneYesCount,
        incomplete: workdoneNoCount,
      },
      {
      id: 4,
      title: "Attendance",
      imageUrl:
        "https://www.iconshock.com/image/RealVista/Education/attendance_list",
      present: presentCount,
      absent: absentCount < 0 ? 0 : absentCount,
      halfDay: halfDayCount,
      tardy: tardyCount,
      totalEmployees: totalEmployeesCount,
    },

    ];

    const chartData = attendanceTableData.map((row) => ({
      name: row.name,
      totalHours: parseFloat(row.totalHours),
    }));

    return (
      <div className="dashboard-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Sidebar />
        <div className="main-content">
          <div className="card-wrapper">
            {cardData.map((card) => (
              <div key={card.id} className="custom-card">
                <img src={card.imageUrl} alt={card.title} className="card-img" />
                <h3 className="card-text">{card.title}</h3>
              {card.id !== 4 ? (
  <>
    <p><strong>Completed:</strong> {card.completed}</p>
    <p><strong>Incomplete:</strong> {card.incomplete}</p>
  </>
) : (
  <>
    <p><strong>Present:</strong> {card.present}</p>
    <p><strong>Absent:</strong> {card.absent}</p>
    <p><strong>Tardy:</strong> {card.halfDay}</p>  {/* <-- Added here */}
  </>
)}

              </div>
            ))}
          </div>

          <div className="table-container" style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "linear-gradient(to right, #e0f7fa, #ffffff)",
              padding: "12px 20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              fontSize: "18px",
              fontWeight: 600,
              color: "#00796b"
            }}>
              🕒 Employees Timing Report
            </div>

            <div style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "linear-gradient(to right, #ffffff, #f0f0f0)",
              padding: "12px 18px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <label htmlFor="date-picker">Select Date:</label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #ccc" }}
              />
            </div>

            <table className="attendance-table" style={{ marginTop: "70px" }}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Entry Time</th>
                  <th>Leaving Time</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {attendanceTableData.length > 0 ? (
                  attendanceTableData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.name}</td>
                      <td>{row.entryTime}</td>
                      <td>{row.leavingTime}</td>
                      <td>{row.totalHours}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No attendance records found for selected date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 📊 Chart placed under the table */}
          
          </div>
            <div style={{ marginTop: "60px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
              <h3 style={{ marginBottom: "20px", textAlign: "center", color: "#00796b" }}>
                ⏱ Total Hours Worked (Chart)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalHours" stroke="#00796b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
             <div style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "20px",
          alignItems: "center",
          gap: "10px",
          color: "#00796b",
          fontWeight: "600"
        }}>
         
        </div>

        {/* Monthly Employee Hours Chart */}
       
        </div>
      </div>
    );
  };

  export default Dashboard;
