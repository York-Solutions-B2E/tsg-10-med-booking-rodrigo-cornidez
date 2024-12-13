package york.medical.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import york.medical.dtos.requests.DoctorRequest;
import york.medical.dtos.responses.DoctorResponse;
import york.medical.services.DoctorService;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@Validated
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // Fetch all doctors
    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllDoctors();
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }

    // Fetch a doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable Long id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return new ResponseEntity<>(doctor, HttpStatus.OK);
    }

    // Fetch doctors by Specialty ID
    @GetMapping("/specialty/{id}")
    public ResponseEntity<List<DoctorResponse>> getDoctorsBySpecialtyId(@PathVariable("id") Long specialtyId) {
        List<DoctorResponse> doctors = doctorService.getDoctorsBySpecialtyId(specialtyId);
        return ResponseEntity.ok(doctors);
    }

    // Create a new doctor with availability
    @PostMapping
    public ResponseEntity<DoctorResponse> createDoctor(@Valid @RequestBody DoctorRequest doctorRequest) {
        DoctorResponse doctorResponse = doctorService.createDoctor(doctorRequest);
        return new ResponseEntity<>(doctorResponse, HttpStatus.CREATED);
    }

    // Update a doctor
    @PutMapping("/{id}")
    public ResponseEntity<DoctorResponse> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorRequest doctorRequest) {
        DoctorResponse updatedDoctor = doctorService.updateDoctor(id, doctorRequest);
        return new ResponseEntity<>(updatedDoctor, HttpStatus.OK);
    }

    // Delete a doctor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
