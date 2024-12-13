package york.medical.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import york.medical.dtos.requests.AppointmentAvailableRequest;
import york.medical.dtos.requests.AppointmentRequest;
import york.medical.dtos.responses.AppointmentResponse;
import york.medical.dtos.responses.SlotResponse;
import york.medical.services.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Fetch Available Slots
    @PostMapping("/available")
    public ResponseEntity<List<SlotResponse>> getAvailableSlots(@Valid @RequestBody AppointmentAvailableRequest request) {
        List<SlotResponse> slots = appointmentService.getAvailableSlots(
                request.getDoctorId(), request.getDate());
        return new ResponseEntity<>(slots, HttpStatus.OK);
    }

    // Get Appointments by Okta ID
    @GetMapping("/patient")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByOktaId(@AuthenticationPrincipal OAuth2User user) {
        String oktaId = (String) user.getAttributes().get("sub");
        List<AppointmentResponse> appointments = appointmentService.getAllAppointmentsByOktaId(oktaId);
        return ResponseEntity.ok(appointments);
    }

    // Create Appointment
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.createAppointment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Update Appointment
    @PutMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> updateAppointment(@PathVariable Long appointmentId,
                                                                 @Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.updateAppointment(appointmentId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Cancel Appointment
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long appointmentId) {
        appointmentService.cancelAppointment(appointmentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
