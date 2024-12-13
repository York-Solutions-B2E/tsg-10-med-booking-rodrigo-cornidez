import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SpecialtyModal from "./SpecialtyModal";
import { useAppContext } from "../../context/AppContext";

export default function SpecialtyHandler() {
  const { api } = useAppContext();
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch Specialties
  const fetchSpecialties = async () => {
    try {
      const result = await api.get("/specialties");
      setSpecialties(
        result.map((spec) => ({
          ...spec,
          id: spec.specialtyId,
        }))
      );
    } catch (err) {
      console.error("Error fetching specialties:", err.message);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Modal Handlers
  const handleOpenModal = (specialty = null) => {
    setSelectedSpecialty(specialty);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSpecialty(null);
    fetchSpecialties();
  };

  const handleSaveSpecialty = async (formData) => {
    try {
      if (selectedSpecialty) {
        await api.put(`/specialties/${selectedSpecialty.id}`, formData);
      } else {
        await api.post("/specialties", formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving specialty:", err.message);
      alert("Failed to save specialty.");
    }
  };

  const handleDeleteSpecialty = async () => {
    if (!selectedSpecialty) return;

    if (
      window.confirm(`Are you sure you want to delete ${selectedSpecialty.name}?`)
    ) {
      try {
        await api.delete(`/specialties/${selectedSpecialty.id}`);
        setSelectedSpecialty(null);
        fetchSpecialties();
      } catch (err) {
        console.error("Error deleting specialty:", err.message);
        alert("Failed to delete specialty.");
      }
    }
  };

  // Specialty Table Columns
  const specialtyColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Specialty Name", width: 200 },
  ];

  return (
    <>
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
          onClick={() => handleOpenModal()}
        >
          Create Specialty
        </button>
        {selectedSpecialty && (
          <>
            <button
              className="px-4 py-2 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
              onClick={() => handleOpenModal(selectedSpecialty)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
              onClick={handleDeleteSpecialty}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col h-auto p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
        <DataGrid
          rows={specialties}
          columns={specialtyColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onRowClick={(params) => setSelectedSpecialty(params.row)}
          className="bg-white dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      {isModalOpen && (
        <SpecialtyModal
          specialty={selectedSpecialty}
          onSave={handleSaveSpecialty}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
