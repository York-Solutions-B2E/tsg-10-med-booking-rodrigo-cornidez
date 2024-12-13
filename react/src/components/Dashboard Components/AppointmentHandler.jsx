import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AppointmentModal from "./AppointmentModal";
import { useAppContext } from "../../context/AppContext";
import capitalizeAndFormat from "../../utilities/capitalizeAndFormat";

const AppointmentHandler = () => {
  const { api } = useAppContext();
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      const result = await api.get("/appointments/patient");
      setAppointments(
        result.map((appt) => ({
          ...appt,
          id: appt.appointmentId,
          appointmentDate: appt.date,
          timeSlotId: appt.slotId,
          visitType: capitalizeAndFormat(appt.visitType),
          appointmentStatus: capitalizeAndFormat(appt.status),
        }))
      );
    } catch (err) {
      console.warn("Failed to fetch appointments:", err.message);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment({
        ...appointment,
        visitType: appointment.visitType?.toUpperCase(),
        appointmentStatus: appointment.appointmentStatus?.toUpperCase(),
      });
    } else {
      setSelectedAppointment(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    fetchAppointments();
  };

  const handleSaveAppointment = async (formData) => {
    try {
      if (selectedAppointment) {
        await api.put(`/appointments/${selectedAppointment.id}`, formData);
      } else {
        await api.post("/appointments", formData);
      }
      handleCloseModal();
    } catch (err) {
      window.alert(err.message);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    if (window.confirm(`Are you sure you want to delete this appointment?`)) {
      try {
        await api.delete(`/appointments/${selectedAppointment.id}`);
        setSelectedAppointment(null);
        fetchAppointments();
      } catch (err) {
        console.error("Error deleting appointment:", err.message);
      }
    }
  };

  const columns = [
    { field: "id", headerName: "Appointment ID", width: 120 },
    { field: "patientFirstName", headerName: "First Name", width: 150 },
    { field: "patientLastName", headerName: "Last Name", width: 150 },
    { field: "doctorName", headerName: "Doctor Name", width: 200 },
    { field: "appointmentDate", headerName: "Date", width: 150 },
    { field: "startTime", headerName: "Start Time", width: 120 },
    { field: "endTime", headerName: "End Time", width: 120 },
    { field: "visitType", headerName: "Visit Type", width: 150 },
    { field: "appointmentStatus", headerName: "Status", width: 150 },
  ];

  return (
    <section className="container px-4 mx-auto md:px-8 lg:px-16">
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded"
          onClick={() => handleOpenModal()}
        >
          Create Appointment
        </button>
        {selectedAppointment && (
          <>
            <button
              className="px-4 py-2 text-white bg-yellow-600 rounded"
              onClick={() => handleOpenModal(selectedAppointment)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 text-white bg-red-600 rounded"
              onClick={handleDeleteAppointment}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <div className="p-4 bg-white rounded shadow">
        <DataGrid
          rows={appointments}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onRowClick={(params) => {setSelectedAppointment(params.row)}}
        />
      </div>

      {isModalOpen && (
        <AppointmentModal
          appointment={selectedAppointment}
          onSave={handleSaveAppointment}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default AppointmentHandler;
