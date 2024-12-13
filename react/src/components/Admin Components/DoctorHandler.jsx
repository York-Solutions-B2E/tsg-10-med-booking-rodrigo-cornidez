import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DoctorModal from "./DoctorModal";
import { useAppContext } from "../../context/AppContext";
import capitalizeAndFormat from "../../utilities/capitalizeAndFormat";

export default function DoctorHandler() {
  const { api } = useAppContext();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const result = await api.get("/doctors");
      setDoctors(
        result.map((doc) => ({
          ...doc,
          id: doc.doctorId,
          formattedEmploymentStatus: capitalizeAndFormat(doc.employmentStatus),
        }))
      );
    } catch (err) {
      console.error("Error fetching doctors:", err.message);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Modal Handlers
  const handleOpenModal = (doctor = null) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDoctor(null);
    fetchDoctors();
  };

  const handleSaveDoctor = async (formData) => {
    try {
      if (selectedDoctor) {
        await api.put(`/doctors/${selectedDoctor.id}`, formData);
      } else {
        await api.post("/doctors", formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving doctor:", err.message);
      alert("Failed to save doctor.");
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;

    if (window.confirm(`Are you sure you want to delete Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}?`)
    ) {
      try {
        await api.delete(`/doctors/${selectedDoctor.id}`);
        setSelectedDoctor(null);
        fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err.message);
        alert("Failed to delete doctor.");
      }
    }
  };

  // Doctor Table Columns
  const doctorColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "specialtyName", headerName: "Specialization", width: 150 },
    {
      field: "formattedEmploymentStatus",
      headerName: "Employment Status",
      width: 150,
    },
  ];

  return (
    <>
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
          onClick={() => handleOpenModal()}
        >
          Create Doctor
        </button>
        {selectedDoctor && (
          <>
            <button
              className="px-4 py-2 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
              onClick={() => handleOpenModal(selectedDoctor)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
              onClick={handleDeleteDoctor}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col h-auto p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
        <DataGrid
          rows={doctors}
          columns={doctorColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onRowClick={(params) => setSelectedDoctor(params.row)}
          className="bg-white dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      {isModalOpen && (
        <DoctorModal
          doctor={selectedDoctor}
          onSave={handleSaveDoctor}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
