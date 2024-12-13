package york.medical.dtos.requests;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import york.medical.enums.DayOfWeek;
import york.medical.enums.EmploymentStatus;

import java.time.LocalTime;
import java.util.List;

@Data
public class DoctorRequest {
    @NotNull(message = "firstName must be provided.")
    private String firstName;

    @NotNull(message = "lastName must be provided.")
    private String lastName;

    @NotNull(message = "specialtyId must be provided.")
    private Long specialtyId;

    @NotNull(message = "availabilities must be provided.")
    private List<AvailabilityRequest> availabilities;

    @Nullable
    private EmploymentStatus employmentStatus = null;

    @Data
    public static class AvailabilityRequest {
        @NotNull(message = "dayOfWeek must be provided.")
        private DayOfWeek dayOfWeek;

        @NotNull(message = "startTime must be provided.")
        private LocalTime startTime;

        @NotNull(message = "endTime must be provided.")
        private LocalTime endTime;
    }
}
