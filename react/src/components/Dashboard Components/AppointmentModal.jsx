import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import CloseIcon from "@mui/icons-material/Close";
import capitalizeAndFormat from "../../utilities/capitalizeAndFormat";
import toEnumFormat from "../../utilities/toEnumFormat";
import dayjs from "dayjs";
import { useAppContext } from "../../context/AppContext";

const initialForm = {
  patientFirstName: "",
  patientLastName: "",
  patientDateOfBirth: "",
  appointmentDate: null,
  doctorId: "",
  timeSlotId: "",
  visitType: "IN_PERSON",
  specializationId: "",
  appointmentStatus: "CONFIRMED",
};

export default function AppointmentModal({ appointment, onSave, onClose }) {
  const { api, user } = useAppContext();
  const [patientId, setPatientId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prefill form for edit
  useEffect(() => {
    if (appointment) {
      setFormData((prev) => ({
        ...prev,
        ...appointment,
        specializationId: appointment.specialtyId,
        doctorId: appointment.doctorId,
        visitType: toEnumFormat(appointment.visitType),
      }));
    }
  }, [appointment]);

  // Fetch Specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const result = await api.get("/specialties");
        setSpecializations(result.map((spec) => ({ ...spec, id: spec.specialtyId })));

      } catch (err) {
        console.error("Error fetching specializations:", err.message);
      }
    };

    if (user) {
      fetchSpecializations();
    }
  }, [user]);

  // Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      if (formData.specializationId) {
        const result = await api.get(`/doctors/specialty/${formData.specializationId}`);
        setDoctors(result);
      } else {
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, [formData.specializationId]);

  // Fetch Time Slots for selected doctor and date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (formData.doctorId && formData.appointmentDate) {
        try {
          const payload = { doctorId: formData.doctorId, date: formData.appointmentDate };
          const result = await api.post("/appointments/available", payload);
          setTimeSlots(result);
        } catch (err) {
          console.error("Error fetching time slots:", err.message);
        }
      } else {
        setTimeSlots([]);
      }
    };
    fetchTimeSlots();
  }, [formData.doctorId, formData.appointmentDate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "specializationId") {
      setDoctors([]);
      setFormData((prev) => ({ ...prev, doctorId: "", timeSlotId: "" }));
    }
    if (field === "appointmentDate") setTimeSlots([]);
  };

  useEffect(() => {
    if (user?.given_name && user?.family_name) {
      const initializeForm = async () => {
        try {
          const patientResponse = await api.get("/users");
  
          if (patientResponse) {
            setFormData((prev) => ({
              ...prev,
              patientFirstName: patientResponse.firstName,
              patientLastName: patientResponse.lastName,
              patientDateOfBirth: patientResponse.dob,
            }));
          } else {
            // Fallback to user context
            setFormData((prev) => ({
              ...prev,
              patientFirstName: user.given_name,
              patientLastName: user.family_name,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch patient data:", error);
  
          // Fallback to user context
          setFormData((prev) => ({
            ...prev,
            patientFirstName: user.given_name,
            patientLastName: user.family_name,
          }));
        } finally {
          setLoading(false);
        }
      };
  
      initializeForm();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      let currentPatientId = patientId;

      if (!patientId) {
        const userPayload = {
          firstName: formData.patientFirstName,
          lastName: formData.patientLastName,
          dob: formData.patientDateOfBirth,
        };
        const newPatient = await api.post("/users", userPayload);
        currentPatientId = newPatient.patientId;
        setPatientId(currentPatientId);
      }

      const appointmentPayload = {
        patientId: currentPatientId,
        slotId: formData.timeSlotId,
        doctorId: formData.doctorId,
        visitType: formData.visitType,
      };

      // Show confirmation alert
      const summaryMessage = `
      Confirm Appointment Details:
      
      Patient: ${formData.patientFirstName} ${formData.patientLastName}
      Date: ${formData.appointmentDate}
      Visit Type: ${capitalizeAndFormat(formData.visitType)}
      
      ${
        formData.visitType === "IN_PERSON"
          ? "* Note: Please arrive 15 minutes before the scheduled appointment time."
          : ""
      }
    `;

    const isConfirmed = window.confirm(summaryMessage.trim());
    if (!isConfirmed) return;
      onSave(appointmentPayload);
    } catch (error) {
      console.error("Error saving appointment:", error.message);
    }
  };

  const isSpecializationDisabled = !formData.patientFirstName || !formData.patientLastName || !formData.patientDateOfBirth;
  const isDoctorDisabled = !formData.specializationId;
  const isCalendarDisabled = !formData.doctorId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-fit max-w-[800px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{appointment ? "Edit Appointment" : "Create Appointment"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-[700px]">
          {/* Left Column */}
          <div className="space-y-4">
            <TextField
              label="First Name"
              fullWidth
              value={formData.patientFirstName}
              onChange={(e) => handleChange("patientFirstName", e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={formData.patientLastName}
              onChange={(e) => handleChange("patientLastName", e.target.value)}
            />
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              value={formData.patientDateOfBirth}
              inputProps={{
                max: new Date(new Date().setDate(new Date().getDate() - 1))
                  .toISOString()
                  .split("T")[0],
              }}
              onChange={(e) => handleChange("patientDateOfBirth", e.target.value)}
            />
            <TextField
              label="Specialization"
              select
              fullWidth
              value={formData.specializationId}
              onChange={(e) => handleChange("specializationId", e.target.value)}
              disabled={isSpecializationDisabled}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec.id} value={spec.id}>
                  {spec.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Doctor"
              value={formData.doctorId || ""}
              onChange={(e) => handleChange("doctorId", e.target.value)}
              disabled={isDoctorDisabled}
            >
              {doctors.map((doc) => (
                <MenuItem key={doc.doctorId} value={doc.doctorId}>
                  {`Dr. ${doc.firstName} ${doc.lastName}`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Appointment Type"
              value={formData.visitType}
              onChange={(e) => handleChange("visitType", e.target.value)}
            >
              {["IN_PERSON", "TELEHEALTH"].map((type) => (
                <MenuItem key={type} value={type}>
                  {capitalizeAndFormat(type)}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <DateCalendar
              value={formData.appointmentDate ? dayjs(formData.appointmentDate) : null}
              onChange={(date) => handleChange("appointmentDate", date.format("YYYY-MM-DD"))}
              disabled={isCalendarDisabled}
              disablePast
            />
            <div>
              <h6>Available Time Slots</h6>
              <div className="space-y-2 overflow-y-auto max-h-48">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <Button
                      key={slot.slotId}
                      variant={formData.timeSlotId === slot.slotId ? "contained" : "outlined"}
                      onClick={() => handleChange("timeSlotId", slot.slotId)}
                      fullWidth
                    >
                      {`${slot.startTime} - ${slot.endTime}`}
                    </Button>
                  ))
                ) : (
                  <p>No available slots</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 space-x-4">
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={!formData.timeSlotId}>
            Confirm Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
