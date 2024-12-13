package york.medical.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import york.medical.entities.Specialty;
import york.medical.services.SpecialtyService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/specialties")
public class SpecialtyController {

    private final SpecialtyService specialtyService;

    @Autowired
    public SpecialtyController(SpecialtyService specialtyService) {
        this.specialtyService = specialtyService;
    }

    // Fetch all specialties
    @GetMapping
    public ResponseEntity<List<Specialty>> getAllSpecialties() {
        List<Specialty> specialties = specialtyService.getAllSpecialties();
        return new ResponseEntity<>(specialties, HttpStatus.OK);
    }

    // Fetch a specialty by ID
    @GetMapping("/{id}")
    public ResponseEntity<Specialty> getSpecialtyById(@PathVariable Long id) {
        Specialty specialty = specialtyService.getSpecialtyById(id);
        return new ResponseEntity<>(specialty, HttpStatus.OK);
    }

    // Create a new specialty
    @PostMapping
    public ResponseEntity<Specialty> createSpecialty(@Valid @RequestBody Specialty specialty) {
        Specialty createdSpecialty = specialtyService.createSpecialty(specialty);
        return new ResponseEntity<>(createdSpecialty, HttpStatus.CREATED);
    }

    // Update an existing specialty
    @PutMapping("/{id}")
    public ResponseEntity<Specialty> updateSpecialty(@PathVariable Long id, @Valid @RequestBody Specialty specialty) {
        Specialty updatedSpecialty = specialtyService.updateSpecialty(id, specialty);
        return new ResponseEntity<>(updatedSpecialty, HttpStatus.OK);
    }

    // Delete a specialty by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialty(@PathVariable Long id) {
        specialtyService.deleteSpecialty(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
