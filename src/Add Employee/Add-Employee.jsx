import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddEmployee.css";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    designation: "",
    bloodGroup: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    entryTime: "",
    leavingTime: "",
    employmentType: "" // New field added
  });

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      designation,
      bloodGroup,
      dob,
      email,
      phone,
      address,
      entryTime,
      leavingTime,
      employmentType
    } = employee;

    if (
      !name ||
      !designation ||
      !bloodGroup ||
      !dob ||
      !email ||
      !phone ||
      !address ||
      !entryTime ||
      !leavingTime ||
      !employmentType
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits!");
      return;
    }

    try {
      await addDoc(collection(db, "employees"), employee);
      toast.success("Employee added successfully!");

      setTimeout(() => {
        setEmployee({
          name: "",
          designation: "",
          bloodGroup: "",
          dob: "",
          email: "",
          phone: "",
          address: "",
          entryTime: "",
          leavingTime: "",
          employmentType: ""
        });
      }, 2000);
    } catch (error) {
      toast.error("Error adding employee: " + error.message);
    }
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <div className="container mt-5">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Add Employee</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name :</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Designation :</label>
                <input
                  type="text"
                  className="form-control"
                  name="designation"
                  value={employee.designation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Blood Group :</label>
                <select
                  className="form-control"
                  name="bloodGroup"
                  value={employee.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date of Birth :</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={employee.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address :</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number :</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address :</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={employee.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Actual Entry Time :</label>
                <input
                  type="time"
                  className="form-control"
                  name="entryTime"
                  value={employee.entryTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Actual Leaving Time :</label>
                <input
                  type="time"
                  className="form-control"
                  name="leavingTime"
                  value={employee.leavingTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Employment Type :</label>
                <select
                  className="form-control"
                  name="employmentType"
                  value={employee.employmentType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Add Employee
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
