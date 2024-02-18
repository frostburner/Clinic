// Import the necessary libraries
import React, { useEffect, useState } from "react";
import styles from "./Table.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentsTable = () => {
  const [allStudents, setallStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/students/`)
      .then((response) => {
        setallStudents(response.data.reverse());
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = allStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/students/${id}`);
      navigate(0);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <table className={styles.table_group}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Year Level</th>
            <th>Course</th>
            <th>Complaint</th>
            <th>Medicine</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((students) => (
            <tr key={students.id}>
              <td>{students.firstName}</td>
              <td>{students.lastName}</td>
              <td>{students.year}</td>
              <td>{students.course}</td>
              <td>{students.complaint}</td>
              <td>{students.studentsmed.name}</td>
              <td>
                {new Date(students.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(allStudents.length / studentsPerPage) }, (_, index) => index + 1).map((pageNumber) => (
          <button key={pageNumber} className={pageNumber === currentPage ? styles.active : null} onClick={() => paginate(pageNumber)}>
            {pageNumber}
          </button>
        ))}
      </div>
    </>
  );
};

export default StudentsTable;
