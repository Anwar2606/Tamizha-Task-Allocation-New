import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../Sidebar/Sidebar";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, "employees", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmployee(docSnap.data());
        } else {
          console.error("No such employee!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!employee) return <p>No employee found.</p>;

  return (
    <div className="main-container">
  <Sidebar />
  <div className="profile-content">
    <div className="profile-card">
      <h2 className="profile-title">Employee Profile</h2>
      <div className="profile-grid">
        <div className="profile-row"><strong>Name:</strong> {employee.name}</div>
        <div className="profile-row"><strong>Designation:</strong> {employee.designation || "-"}</div>
        <div className="profile-row"><strong>Employment Type:</strong> {employee.employmentType || "-"}</div>
        <div className="profile-row"><strong>Address:</strong> {employee.address || "-"}</div>
        <div className="profile-row"><strong>Blood Group:</strong> {employee.bloodGroup}</div>
        <div className="profile-row"><strong>DOB:</strong> {employee.dob}</div>
        <div className="profile-row"><strong>Email:</strong> {employee.email}</div>
        <div className="profile-row"><strong>Phone:</strong> {employee.phone}</div>
        <div className="profile-row"><strong>Entry Time:</strong> {employee.entryTime || "-"}</div>
        <div className="profile-row"><strong>Leaving Time:</strong> {employee.leavingTime || "-"}</div>
      </div>
    </div>
  </div>
</div>

  );
};

export default EmployeeProfile;
