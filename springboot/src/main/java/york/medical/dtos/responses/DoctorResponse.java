package york.medical.dtos.responses;

import lombok.Data;
import york.medical.enums.DayOfWeek;
import york.medical.enums.EmploymentStatus;

import java.time.LocalTime;
import java.util.List;

@Data
public class DoctorResponse {
    private Long doctorId;
    private String firstName;
    private String lastName;
    private String specialtyName;
    private Long specialtyId;
    private List<AvailabilityResponse> availabilities;
    private EmploymentStatus employmentStatus;

    @Data
    public static class AvailabilityResponse {
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}
