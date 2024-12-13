import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Checkbox, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppContext } from "../../context/AppContext";

const defaultAvailabilities = [
  { dayOfWeek: "MONDAY", enabled: false, startTime: "", endTime: "" },
  { dayOfWeek: "TUESDAY", enabled: false, startTime: "", endTime: "" },
  { dayOfWeek: "WEDNESDAY", enabled: false, startTime: "", endTime: "" },
  { dayOfWeek: "THURSDAY", enabled: false, startTime: "", endTime: "" },
  { dayOfWeek: "FRIDAY", enabled: false, startTime: "", endTime: "" },
];

const initialForm = {
  firstName: "",
  lastName: "",
  specialtyId: "",
  employmentStatus: "ACTIVE",
  availabilities: defaultAvailabilities,
};

export default function DoctorModal({ doctor, onSave, onClose }) {
  const { api } = useAppContext();
  const [formData, setFormData] = useState(initialForm);
  const [specialties, setSpecialties] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const result = await api.get("/specialties");
        const formattedSpecialties = result.map((spec) => ({
          id: spec.specialtyId,
          name: spec.name,
        }));
        setSpecialties(formattedSpecialties);

        if (doctor && doctor.specialtyId) {
          setFormData((prev) => ({
            ...prev,
            specialtyId: doctor.specialtyId,
          }));
        }
      } catch (error) {
        console.error("Error fetching specialties:", error.message);
      }
    };

    fetchSpecialties();
  }, [doctor]);

  useEffect(() => {
    if (doctor) {
      const updatedAvailabilities = defaultAvailabilities.map((day) => {
        const matchedDay = doctor.availabilities?.find(
          (av) => av.dayOfWeek === day.dayOfWeek
        );
        return matchedDay
          ? { ...day, enabled: true, startTime: matchedDay.startTime, endTime: matchedDay.endTime }
          : day;
      });

      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        specialtyId: doctor.specialtyId || "",
        employmentStatus: doctor.employmentStatus || "ACTIVE",
        availabilities: updatedAvailabilities,
      });
    }
  }, [doctor]);

  useEffect(() => {
    const isValid =
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.specialtyId &&
      formData.availabilities.every((day) => {
        if (day.enabled) {
          return day.startTime && day.endTime;
        }
        return true;
      });

    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (dayIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.availabilities];
      updated[dayIndex] = { ...updated[dayIndex], [field]: value };
      return { ...prev, availabilities: updated };
    });
  };

  const handleDayToggle = (dayIndex) => {
    setFormData((prev) => {
      const updated = [...prev.availabilities];
      updated[dayIndex].enabled = !updated[dayIndex].enabled;
      return { ...prev, availabilities: updated };
    });
  };

  const handleSave = () => {
    const filteredFormData = {
      ...formData,
      availabilities: formData.availabilities
        .filter((day) => day.enabled)
        .map(({ dayOfWeek, startTime, endTime }) => ({
          dayOfWeek,
          startTime,
          endTime,
        })),
    };

    onSave(filteredFormData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {doctor ? "Edit Doctor" : "Create Doctor"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <TextField fullWidth label="First Name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
          <TextField fullWidth label="Last Name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
          <TextField select fullWidth label="Specialty" value={formData.specialtyId} onChange={(e) => handleInputChange("specialtyId", e.target.value)}>
            {specialties.map((specialty) => (
              <MenuItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField select fullWidth label="Employment Status" value={formData.employmentStatus} onChange={(e) => handleInputChange("employmentStatus", e.target.value)}>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </TextField>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Availability</h3>
            <div className="space-y-3">
              {formData.availabilities.map((day, index) => (
                <div key={day.dayOfWeek} className="flex items-center space-x-4">
                  <Checkbox checked={day.enabled} onChange={() => handleDayToggle(index)} />
                  <span className="w-20">{day.dayOfWeek}</span>
                  <TextField label="Start Time" type="time" value={day.startTime} disabled={!day.enabled} onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)} />
                  <TextField label="End Time" type="time" value={day.endTime} disabled={!day.enabled} onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={!isFormValid}>
            Save Doctor
          </Button>
        </div>
      </div>
    </div>
  );
}
