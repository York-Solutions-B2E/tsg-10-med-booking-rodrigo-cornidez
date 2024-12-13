package york.medical.dtos.requests;


import lombok.Data;
import york.medical.enums.SlotStatus;

import jakarta.validation.constraints.NotNull;
import york.medical.enums.VisitType;

@Data
public class AppointmentRequest {
    @NotNull(message = "Patient ID must be provided.")
    private Long patientId;

    @NotNull(message = "Slot ID must be provided.")
    private Long slotId;

    @NotNull(message = "Doctor ID must be provided.")
    private Long doctorId;

    @NotNull(message = "visitType must be provided")
    private VisitType visitType;

}
