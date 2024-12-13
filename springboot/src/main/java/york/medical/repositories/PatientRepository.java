package york.medical.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import york.medical.entities.Patient;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByAuth_OktaId(String oktaId);
}
