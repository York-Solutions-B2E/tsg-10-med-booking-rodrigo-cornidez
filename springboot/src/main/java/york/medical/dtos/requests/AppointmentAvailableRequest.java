package york.medical.dtos.requests;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Data
public class AppointmentAvailableRequest {

    @NotNull(message = "Doctor ID is required.")
    private Long doctorId;

    @NotNull(message = "Date is required.")
    @FutureOrPresent(message = "Cannot display past appointment availabilities.")
    private LocalDate date;
}
