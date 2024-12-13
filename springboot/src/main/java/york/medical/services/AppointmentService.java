package york.medical.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import york.medical.dtos.requests.AppointmentRequest;
import york.medical.dtos.responses.AppointmentResponse;
import york.medical.dtos.responses.SlotResponse;
import york.medical.entities.Appointment;
import york.medical.entities.AppointmentSlot;
import york.medical.entities.Patient;
import york.medical.enums.AppointmentStatus;
import york.medical.enums.SlotStatus;
import york.medical.exceptions.ResourceNotFoundException;
import york.medical.repositories.*;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentSlotRepository slotRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository,
                              AppointmentSlotRepository slotRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.slotRepository = slotRepository;
        this.patientRepository = patientRepository;
    }

    // Fetch Available Slots
    public List<SlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        try {
            return slotRepository.findByDoctor_DoctorIdAndDateAndStatus(doctorId, date, SlotStatus.AVAILABLE)
                    .stream()
                    .map(this::mapSlotToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching available slots.", e);
        }
    }

    public List<AppointmentResponse> getAllAppointmentsByOktaId(String oktaId) {
        // Find the patient by Okta ID
        Patient patient = patientRepository.findByAuth_OktaId(oktaId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found for Okta ID: " + oktaId));

        // Retrieve appointments for the patient
        List<Appointment> appointments = appointmentRepository.findByPatient_PatientId(patient.getPatientId());

        return appointments.stream()
                .map(this::mapAppointmentToResponse)
                .collect(Collectors.toList());
    }

    public long getNonCancelledAppointmentsCount() {
        return appointmentRepository.countByStatusNot(AppointmentStatus.CANCELLED);
    }

    // Get appointments by Patient ID
    public List<AppointmentResponse> getAllAppointmentsByPatientId(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatient_PatientId(patientId);

        if (appointments.isEmpty()) {
            throw new ResourceNotFoundException("No appointments found for patient with ID: " + patientId);
        }

        return appointments.stream()
                .map(this::mapAppointmentToResponse)
                .collect(Collectors.toList());
    }

    // Create Appointment
    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request) {

        // Validate Patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + request.getPatientId()));

        // Validate Slot
        AppointmentSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with ID: " + request.getSlotId()));

        if (!slot.getStatus().equals(SlotStatus.AVAILABLE)) {
            throw new IllegalArgumentException("Slot is not available for booking.");
        }

        // Prevent duplicate appointments (non-cancelled)
        appointmentRepository.findByPatient_PatientIdAndDoctor_DoctorIdAndDateAndStatusNot(
                        patient.getPatientId(), slot.getDoctor().getDoctorId(), slot.getDate(), AppointmentStatus.CANCELLED)
                .ifPresent(existingAppointment -> {
                    throw new IllegalArgumentException("Patient already has an active appointment with this doctor on the same day.");
                });

        // Create Appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(slot.getDoctor());
        appointment.setSlot(slot);
        appointment.setDate(slot.getDate());
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setVisitType(request.getVisitType());

        appointmentRepository.save(appointment);

        // Update Slot to RESERVED
        slot.setStatus(SlotStatus.RESERVED);
        slotRepository.save(slot);

        return mapAppointmentToResponse(appointment);
    }

    // Update Appointment
    @Transactional
    public AppointmentResponse updateAppointment(Long appointmentId, AppointmentRequest request) {
        // Fetch the existing appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Free up the old slot and cancel the current appointment
        AppointmentSlot oldSlot = appointment.getSlot();
        if (oldSlot != null) {
            oldSlot.setStatus(SlotStatus.AVAILABLE);
            slotRepository.save(oldSlot);
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        // Validate Patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + request.getPatientId()));

        // Validate Slot
        AppointmentSlot newSlot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with ID: " + request.getSlotId()));

        if (!newSlot.getStatus().equals(SlotStatus.AVAILABLE)) {
            throw new IllegalArgumentException("The selected slot is not available.");
        }

        // Prevent duplicate appointments (non-cancelled)
        appointmentRepository.findByPatient_PatientIdAndDoctor_DoctorIdAndDateAndStatusNot(
                        patient.getPatientId(), newSlot.getDoctor().getDoctorId(), newSlot.getDate(), AppointmentStatus.CANCELLED)
                .ifPresent(existingAppointment -> {
                    throw new IllegalArgumentException("Patient already has an active appointment with this doctor on the same day.");
                });

        // Create new appointment
        Appointment newAppointment = new Appointment();
        newAppointment.setPatient(patient);
        newAppointment.setDoctor(newSlot.getDoctor());
        newAppointment.setSlot(newSlot);
        newAppointment.setDate(newSlot.getDate());
        newAppointment.setStatus(AppointmentStatus.CONFIRMED);
        // Use visitType from request if provided, otherwise use existing visitType
        newAppointment.setVisitType(request.getVisitType() != null ? request.getVisitType() : appointment.getVisitType());

        appointmentRepository.save(newAppointment);

        // Update the slot to RESERVED
        newSlot.setStatus(SlotStatus.RESERVED);
        slotRepository.save(newSlot);

        return mapAppointmentToResponse(newAppointment);
    }

    // Cancel Appointment
    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        try {
            // Free up the slot
            AppointmentSlot slot = appointment.getSlot();
            if (slot != null) {
                slot.setStatus(SlotStatus.AVAILABLE);
                slotRepository.save(slot);

                // Dissociate the slot from the appointment
                appointment.setSlot(null);
            }

            // Update appointment status
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while canceling the appointment.", e);
        }
    }

    // Helper: Map Appointment to Response DTO
    private AppointmentResponse mapAppointmentToResponse(Appointment appointment) {
        try {
            AppointmentResponse response = new AppointmentResponse();
            response.setAppointmentId(appointment.getAppointmentId());
            response.setPatientId(appointment.getPatient().getPatientId());
            response.setPatientName(appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName());
            response.setPatientFirstName(appointment.getPatient().getFirstName());
            response.setPatientLastName(appointment.getPatient().getLastName());
            response.setDoctorId(appointment.getDoctor().getDoctorId());
            response.setSpecialtyId(appointment.getDoctor().getSpecialty().getSpecialtyId());
            response.setDoctorName(appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
            response.setDate(appointment.getDate());
            response.setStatus(appointment.getStatus());
            response.setVisitType(appointment.getVisitType());

            // Safely handle null slot
            if (appointment.getSlot() != null) {
                response.setSlotId(appointment.getSlot().getSlotId());
                response.setStartTime(appointment.getSlot().getStartTime());
                response.setEndTime(appointment.getSlot().getEndTime());
            } else {
                response.setSlotId(null);
                response.setStartTime(null);
                response.setEndTime(null);
            }

            return response;
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while mapping the appointment response.", e);
        }
    }

    // Helper: Map Slot to Response DTO
    private SlotResponse mapSlotToResponse(AppointmentSlot slot) {
        try {
            SlotResponse response = new SlotResponse();
            response.setSlotId(slot.getSlotId());
            response.setDoctorId(slot.getDoctor().getDoctorId());
            response.setDoctorName(slot.getDoctor().getFirstName() + " " + slot.getDoctor().getLastName());
            response.setDate(slot.getDate());
            response.setStartTime(slot.getStartTime());
            response.setEndTime(slot.getEndTime());
            response.setStatus(SlotStatus.AVAILABLE);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while mapping the slot response.", e);
        }
    }


}
