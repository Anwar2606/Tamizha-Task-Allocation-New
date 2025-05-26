import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";


import Sidebar from "../Sidebar/Sidebar";
import "./EmployeeList.css";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "employees"), (snapshot) => {
      const employeeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddEmployee = () => {
    navigate("/add-employee");
  };
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this employee?")) {
    try {
      await deleteDoc(doc(db, "employees", id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }
};

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };
const handleShowProfile = (id) => {
  navigate(`/employee-profile/${id}`);
};


  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <div className="container">
          <div className="header">
            <h2>Employee List</h2>
            <div className="button-container">
              <button className="add-employee-btn" onClick={handleAddEmployee}>
                Add Employee
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : employees.length === 0 ? (
            <p className="no-employees">No employees found.</p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Name</th>
                    <th>Blood</th>
                    <th>DOB</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Entry Time</th>
                    <th>Leave Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={employee.id}>
                      <td>{index + 1}</td>
                      <td>{employee.name}</td>
                      <td>{employee.bloodGroup}</td>
                      <td>{employee.dob}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.entryTime || "-"}</td>
                      <td>{employee.leavingTime || "-"}</td>
                <td>
  <div className="action-buttons">
    <button onClick={() => handleShowProfile(employee.id)} className="profile-btn">
      Show Profile
    </button>
    <button onClick={() => handleEdit(employee.id)} className="edit-btn">
      Edit
    </button>
    <button onClick={() => handleDelete(employee.id)} className="delete-btn">
      Delete
    </button>
  </div>
</td>



                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
