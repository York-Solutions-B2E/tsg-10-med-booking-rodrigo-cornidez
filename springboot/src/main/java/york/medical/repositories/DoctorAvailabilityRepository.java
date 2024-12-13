package york.medical.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import york.medical.entities.DoctorAvailability;

import java.util.List;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctor_DoctorId(Long doctorId);
    List<DoctorAvailability> findByDoctor_DoctorIdAndDayOfWeek(Long doctorId, york.medical.enums.DayOfWeek dayOfWeek);

    void deleteByDoctor_DoctorId(Long doctorId);
}
