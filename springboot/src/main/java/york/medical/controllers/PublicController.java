package york.medical.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import york.medical.dtos.responses.StatsResponse;
import york.medical.services.AppointmentService;
import york.medical.services.DoctorService;
import york.medical.services.SpecialtyService;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final DoctorService doctorService;
    private final SpecialtyService specialtyService;
    private final AppointmentService appointmentService;

    @Autowired
    public PublicController(DoctorService doctorService, SpecialtyService specializationService, AppointmentService appointmentService) {
        this.doctorService = doctorService;
        this.specialtyService = specializationService;
        this.appointmentService = appointmentService;
    }

    // General Stats
    @GetMapping("/stats")
    public StatsResponse getStats() {
        long doctorsCount = doctorService.getDoctorsCount();
        long nonCancelledAppointmentsCount = appointmentService.getNonCancelledAppointmentsCount();
        long specialtiesCount = specialtyService.getSpecialtiesCount();

        StatsResponse statsResponse = new StatsResponse();
        statsResponse.setDoctorsCount(doctorsCount);
        statsResponse.setAppointmentsCount(nonCancelledAppointmentsCount);
        statsResponse.setSpecialtiesCount(specialtiesCount);

        return statsResponse;
    }
}
