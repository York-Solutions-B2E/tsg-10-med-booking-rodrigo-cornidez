package york.medical.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import york.medical.dtos.requests.DoctorRequest;
import york.medical.dtos.responses.DoctorResponse;
import york.medical.dtos.responses.DoctorResponse.AvailabilityResponse;
import york.medical.entities.AppointmentSlot;
import york.medical.entities.Doctor;
import york.medical.entities.DoctorAvailability;
import york.medical.entities.Specialty;
import york.medical.enums.EmploymentStatus;
import york.medical.enums.SlotStatus;
import york.medical.exceptions.ResourceNotFoundException;
import york.medical.repositories.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final SpecialtyRepository specialtyRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final AppointmentSlotRepository slotRepository;

    @Autowired
    public DoctorService(DoctorRepository doctorRepository,
                         SpecialtyRepository specialtyRepository,
                         DoctorAvailabilityRepository availabilityRepository,
                         AppointmentSlotRepository slotRepository) {
        this.doctorRepository = doctorRepository;
        this.specialtyRepository = specialtyRepository;
        this.availabilityRepository = availabilityRepository;
        this.slotRepository = slotRepository;
    }

    // Get the count of all active doctors
    public long getDoctorsCount() {
        return doctorRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE);
    }

    // Fetch all doctors
    public List<DoctorResponse> getAllDoctors() {
        try {
            return doctorRepository.findAll().stream()
                    .map(this::mapToDoctorResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching doctors.", e);
        }
    }

    // Fetch doctor by ID
    public DoctorResponse getDoctorById(Long id) {
        try {
            Doctor doctor = doctorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
            return mapToDoctorResponse(doctor);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching doctor with ID: " + id, e);
        }
    }

    // Fetch active doctors by Specialty ID
    public List<DoctorResponse> getDoctorsBySpecialtyId(Long specialtyId) {
        return doctorRepository.findBySpecialty_SpecialtyIdAndEmploymentStatus(specialtyId, EmploymentStatus.ACTIVE)
                .stream()
                .map(this::mapToDoctorResponse)
                .collect(Collectors.toList());
    }

    // Create a new doctor with availability and slots
    @Transactional
    public DoctorResponse createDoctor(DoctorRequest doctorRequest) {

            Specialty specialty = specialtyRepository.findById(doctorRequest.getSpecialtyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Specialty not found with ID: " + doctorRequest.getSpecialtyId()));
        try {
            Doctor doctor = new Doctor();
            doctor.setFirstName(doctorRequest.getFirstName());
            doctor.setLastName(doctorRequest.getLastName());
            doctor.setSpecialty(specialty);
            doctor.setEmploymentStatus(doctorRequest.getEmploymentStatus() != null ? doctorRequest.getEmploymentStatus() : EmploymentStatus.ACTIVE);

            Doctor savedDoctor = doctorRepository.save(doctor);

            // Generate Appointment Time Slots based on Availability
            if (doctorRequest.getAvailabilities() != null) {
                doctorRequest.getAvailabilities().forEach(av -> {
                    DoctorAvailability availability = new DoctorAvailability();
                    availability.setDoctor(savedDoctor);
                    availability.setDayOfWeek(av.getDayOfWeek());
                    availability.setStartTime(av.getStartTime());
                    availability.setEndTime(av.getEndTime());
                    availabilityRepository.save(availability);

                    generateTimeSlots(savedDoctor, availability);
                });
            }

            return mapToDoctorResponse(savedDoctor);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while creating the doctor.", e);
        }
    }

    // Update Doctor and Availability
    @Transactional
    public DoctorResponse updateDoctor(Long doctorId, DoctorRequest doctorRequest) {
        try {
            return doctorRepository.findById(doctorId).map(existingDoctor -> {
                existingDoctor.setFirstName(doctorRequest.getFirstName());
                existingDoctor.setLastName(doctorRequest.getLastName());
                existingDoctor.setEmploymentStatus(doctorRequest.getEmploymentStatus() != null ? doctorRequest.getEmploymentStatus() : existingDoctor.getEmploymentStatus());


                if (doctorRequest.getSpecialtyId() != null) {
                    Specialty specialty = specialtyRepository.findById(doctorRequest.getSpecialtyId())
                            .orElseThrow(() -> new ResourceNotFoundException("Specialty not found with ID: " + doctorRequest.getSpecialtyId()));
                    existingDoctor.setSpecialty(specialty);
                }

                // Update Schedule
                if (doctorRequest.getAvailabilities() != null) {
                    availabilityRepository.deleteByDoctor_DoctorId(doctorId);
                    doctorRequest.getAvailabilities().forEach(av -> {
                        DoctorAvailability availability = new DoctorAvailability();
                        availability.setDoctor(existingDoctor);
                        availability.setDayOfWeek(av.getDayOfWeek());
                        availability.setStartTime(av.getStartTime());
                        availability.setEndTime(av.getEndTime());
                        availabilityRepository.save(availability);

                        generateTimeSlots(existingDoctor, availability);
                    });
                }

                return mapToDoctorResponse(doctorRepository.save(existingDoctor));
            }).orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while updating the doctor.", e);
        }
    }

    // Delete a doctor and clean up relations
    @Transactional
    public void deleteDoctor(Long doctorId) {

            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

            doctor.setEmploymentStatus(EmploymentStatus.INACTIVE);

            doctorRepository.save(doctor);

//        try {
//            // Delete associated availabilities
//            availabilityRepository.deleteByDoctor_DoctorId(doctorId);
//
//            // Delete associated slots
//            slotRepository.deleteByDoctor_DoctorId(doctorId);
//
//            // Delete doctor
//            doctorRepository.deleteById(doctorId);
//        } catch (Exception e) {
//            throw new RuntimeException("An error occurred while deleting doctor with ID: " + doctorId, e);
//        }
    }


    // Generate Slots Based on Availability
    private void generateTimeSlots(Doctor doctor, DoctorAvailability availability) {
        try {
            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusMonths(1);

            while (!today.isAfter(endDate)) {
                if (today.getDayOfWeek().toString().equalsIgnoreCase(availability.getDayOfWeek().toString())) {
                    LocalTime currentTime = availability.getStartTime();
                    while (currentTime.isBefore(availability.getEndTime())) {
                        LocalTime slotEndTime = currentTime.plusMinutes(30);
                        if (slotEndTime.isAfter(availability.getEndTime())) break;

                        if (!slotRepository.existsByDoctor_DoctorIdAndDateAndStartTimeAndEndTime(
                                doctor.getDoctorId(), today, currentTime, slotEndTime)) {
                            AppointmentSlot slot = new AppointmentSlot();
                            slot.setDoctor(doctor);
                            slot.setDate(today);
                            slot.setStartTime(currentTime);
                            slot.setEndTime(slotEndTime);
                            slot.setStatus(SlotStatus.AVAILABLE);
                            slotRepository.save(slot);
                        }

                        currentTime = slotEndTime;
                    }
                }
                today = today.plusDays(1);
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while generating time slots.", e);
        }
    }

    // Map Doctor entity to DoctorResponse DTO
    private DoctorResponse mapToDoctorResponse(Doctor doctor) {
        try {
            DoctorResponse response = new DoctorResponse();
            response.setDoctorId(doctor.getDoctorId());
            response.setFirstName(doctor.getFirstName());
            response.setLastName(doctor.getLastName());
            response.setSpecialtyName(doctor.getSpecialty() != null ? doctor.getSpecialty().getName() : null);
            response.setSpecialtyId(doctor.getSpecialty() != null ? doctor.getSpecialty().getSpecialtyId() : null);
            response.setEmploymentStatus(doctor.getEmploymentStatus());

            List<AvailabilityResponse> availabilityResponses = availabilityRepository
                    .findByDoctor_DoctorId(doctor.getDoctorId()).stream()
                    .map(av -> {
                        AvailabilityResponse availabilityResponse = new AvailabilityResponse();
                        availabilityResponse.setDayOfWeek(av.getDayOfWeek());
                        availabilityResponse.setStartTime(av.getStartTime());
                        availabilityResponse.setEndTime(av.getEndTime());
                        return availabilityResponse;
                    }).collect(Collectors.toList());

            response.setAvailabilities(availabilityResponses);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while mapping doctor response.", e);
        }
    }



}
