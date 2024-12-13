package york.medical.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import york.medical.entities.Doctor;
import york.medical.enums.EmploymentStatus;

import java.util.Collection;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialty_SpecialtyIdAndEmploymentStatus(Long specialtyId, EmploymentStatus employmentStatus);

    long countByEmploymentStatus(EmploymentStatus employmentStatus);
}

