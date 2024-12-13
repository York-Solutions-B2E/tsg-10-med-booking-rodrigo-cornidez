package york.medical.dtos.responses;

import lombok.Data;

@Data
public class StatsResponse {
    private long doctorsCount;
    private long appointmentsCount;
    private long specialtiesCount;
}
