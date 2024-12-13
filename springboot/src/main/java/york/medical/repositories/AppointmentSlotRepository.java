package york.medical.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import york.medical.entities.AppointmentSlot;
import york.medical.enums.SlotStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {
    List<AppointmentSlot> findByDoctor_DoctorIdAndDate(Long doctorId, LocalDate date);
    List<AppointmentSlot> findByDoctor_DoctorIdAndDateAndStatus(Long doctorId, LocalDate date, SlotStatus status);

    boolean existsByDoctor_DoctorIdAndDateAndStartTimeAndEndTime(Long doctorId, LocalDate today, LocalTime currentTime, LocalTime slotEndTime);

    void deleteByDoctor_DoctorId(Long doctorId);
}
