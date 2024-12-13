package york.medical.dtos.responses;

import lombok.Data;
import york.medical.enums.SlotStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SlotResponse {
    private Long slotId;
    private Long doctorId;
    private String doctorName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private SlotStatus status;
}
