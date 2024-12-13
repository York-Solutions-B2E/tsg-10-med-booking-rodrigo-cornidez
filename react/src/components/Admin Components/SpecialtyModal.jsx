import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const initialForm = {
  name: "",
};

export default function SpecialtyModal({ specialty, onSave, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (specialty) {
      setFormData({ name: specialty.name });
    }
  }, [specialty]);

  useEffect(() => {
    setIsFormValid(!!formData.name.trim());
  }, [formData]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData({ name: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {specialty ? "Edit Specialty" : "Create Specialty"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Specialty Name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save Specialty
          </Button>
        </div>
      </div>
    </div>
  );
}
