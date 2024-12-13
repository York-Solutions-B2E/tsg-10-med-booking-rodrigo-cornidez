package york.medical.dtos.responses;

import lombok.Data;
import york.medical.enums.AppointmentStatus;
import york.medical.enums.VisitType;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentResponse {
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private String patientFirstName;
    private String patientLastName;
    private Long doctorId;
    private Long specialtyId;
    private String doctorName;
    private LocalDate date;
    private Long slotId;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatus status;
    private VisitType visitType;
}
