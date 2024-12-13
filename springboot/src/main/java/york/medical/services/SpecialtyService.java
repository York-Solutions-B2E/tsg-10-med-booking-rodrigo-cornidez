package york.medical.services;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import york.medical.entities.Specialty;
import york.medical.exceptions.ResourceNotFoundException;
import york.medical.repositories.SpecialtyRepository;

import java.util.List;

@Service
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;

    @Autowired
    public SpecialtyService(SpecialtyRepository specialtyRepository) {
        this.specialtyRepository = specialtyRepository;
    }

    // Get the specialties count
    public long getSpecialtiesCount() {
        return specialtyRepository.count();
    }

    // Fetch all specialties
    public List<Specialty> getAllSpecialties() {
        try {
            return specialtyRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching all specialties.", e);
        }
    }

    // Fetch specialty by ID
    public Specialty getSpecialtyById(Long id) {
        try {
            return specialtyRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Specialty not found with ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching specialty with ID: " + id, e);
        }
    }

    // Create a new specialty
    @Transactional
    public Specialty createSpecialty(Specialty specialty) {
        try {
                if (specialtyRepository.findByName(specialty.getName()).isPresent()) {
                    throw new IllegalArgumentException("Specialty with name '" + specialty.getName() + "' already exists.");
                }
                return specialtyRepository.save(specialty);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while creating the specialty with ID: " + e);
        }
    }

    // Update an existing specialty
    @Transactional
    public Specialty updateSpecialty(Long id, Specialty updatedSpecialty) {
        try {
            return specialtyRepository.findById(id).map(existingSpecialty -> {
                existingSpecialty.setName(updatedSpecialty.getName());
                return specialtyRepository.save(existingSpecialty);
            }).orElseThrow(() -> new ResourceNotFoundException("Specialty not found with ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while updating the specialty with ID: " + id, e);
        }
    }

    // Delete a specialty by ID
    @Transactional
    public void deleteSpecialty(Long id) {
        try {
            if (!specialtyRepository.existsById(id)) {
                throw new ResourceNotFoundException("Specialty not found with ID: " + id);
            }
            specialtyRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while deleting the specialty with ID: " + id, e);
        }
    }

}
