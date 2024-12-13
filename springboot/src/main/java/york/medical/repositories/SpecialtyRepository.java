package york.medical.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import york.medical.entities.Specialty;

import java.util.Optional;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
    Optional<Specialty> findByName(String name);
}
