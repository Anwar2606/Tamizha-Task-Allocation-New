import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./EditEmployee.css";
import Sidebar from "../Sidebar/Sidebar";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    employmentType: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, "employees", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployee({
            name: data.name ?? "",
            designation: data.designation ?? "",
            bloodGroup: data.bloodGroup ?? "",
            dob: data.dob ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            entryTime: data.entryTime ?? "",
            leavingTime: data.leavingTime ?? "",
            employmentType: data.employmentType ?? ""
          });
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "employees", id), employee);
      navigate("/employeelist");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (loading) return <p className="content">Loading employee data...</p>;

  return (
    <div className="main-container">
      <div className="sidebar">
        <Sidebar />
        <p>Edit employee details</p>
      </div>

      <div className="content">
        <div className="card p-4">
          <h2 className="mb-4">Edit Employee</h2>
          <form onSubmit={handleSubmit}>
            {Object.entries(employee).map(([key, value]) =>
              key === "employmentType" ? (
                <div key={key} className="mb-3">
                  <label className="form-label">Employment Type</label>
                  <select
                    className="form-control"
                    name="employmentType"
                    value={employee.employmentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Employment Type</option>
                    <option value="Full-Time Employee">Full-Time Employee</option>
                    <option value="Part-Time Employee">Part-Time Employee</option>
                  </select>
                </div>
              ) : (
                <div key={key} className="mb-3">
                  <label className="form-label">
                    {key === "dob"
                      ? "Date of Birth"
                      : key === "entryTime"
                      ? "Actual Entry Time"
                      : key === "leavingTime"
                      ? "Actual Leaving Time"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type={
                      key === "dob"
                        ? "date"
                        : key === "entryTime" || key === "leavingTime"
                        ? "time"
                        : key === "email"
                        ? "email"
                        : key === "phone"
                        ? "tel"
                        : "text"
                    }
                    className="form-control"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required
                  />
                </div>
              )
            )}
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
