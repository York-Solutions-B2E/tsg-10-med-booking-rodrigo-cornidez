package york.medical.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import york.medical.dtos.requests.DoctorRequest;
import york.medical.dtos.requests.DoctorRequest.AvailabilityRequest;
import york.medical.entities.Specialty;
import york.medical.enums.DayOfWeek;
import york.medical.services.DoctorService;
import york.medical.services.SpecialtyService;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SpecialtyService specialtyService;
    private final DoctorService doctorService;

    @Autowired
    public DataInitializer(SpecialtyService specialtyService, DoctorService doctorService) {
        this.specialtyService = specialtyService;
        this.doctorService = doctorService;
    }

    @Override
    public void run(String... args) {
        seedSpecialties();
        seedDoctors();
    }

    private void seedSpecialties() {
        if (specialtyService.getSpecialtiesCount() == 0) {
            System.out.println("Seeding Specialties...");
            List<Specialty> specialties = List.of(
                    createSpecialty(1L, "Cardiology"),
                    createSpecialty(2L, "Pediatrics"),
                    createSpecialty(3L, "Dermatology"),
                    createSpecialty(4L, "Orthopedics"),
                    createSpecialty(5L, "Neurology")
            );

            specialties.forEach(specialtyService::createSpecialty);
            System.out.println("Specialties Seeded.");
        } else {
            System.out.println("Specialties already exist. Skipping seeding.");
        }
    }

    private void seedDoctors() {
        if (doctorService.getDoctorsCount() == 0) {
            System.out.println("Seeding Doctors...");
            List<DoctorRequest> doctors = new ArrayList<>();
            doctors.add(createDoctorRequest("John", "Smith", 1L));
            doctors.add(createDoctorRequest("Jane", "Doe", 2L));
            doctors.add(createDoctorRequest("Emily", "Clark", 3L));
            doctors.add(createDoctorRequest("Michael", "Brown", 4L));
            doctors.add(createDoctorRequest("Daniel", "Wilson", 5L));

            doctors.forEach(doctorRequest -> {
                try {
                    doctorService.createDoctor(doctorRequest);
                } catch (Exception e) {
                    System.err.println("Error creating doctor: " + e.getMessage());
                }
            });
            System.out.println("Doctors Seeded.");
        } else {
            System.out.println("Doctors already exist. Skipping seeding.");
        }
    }

    private Specialty createSpecialty(Long id, String name) {
        Specialty specialty = new Specialty();
        specialty.setSpecialtyId(id);
        specialty.setName(name);
        return specialty;
    }

    private DoctorRequest createDoctorRequest(String firstName, String lastName, Long specialtyId) {
        DoctorRequest doctor = new DoctorRequest();
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setSpecialtyId(specialtyId);

        List<AvailabilityRequest> availabilities = new ArrayList<>();
        availabilities.add(createAvailabilityRequest(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(17, 0)));
        availabilities.add(createAvailabilityRequest(DayOfWeek.TUESDAY, LocalTime.of(9, 0), LocalTime.of(17, 0)));
        availabilities.add(createAvailabilityRequest(DayOfWeek.WEDNESDAY, LocalTime.of(9, 0), LocalTime.of(17, 0)));
        availabilities.add(createAvailabilityRequest(DayOfWeek.THURSDAY, LocalTime.of(9, 0), LocalTime.of(17, 0)));
        availabilities.add(createAvailabilityRequest(DayOfWeek.FRIDAY, LocalTime.of(9, 0), LocalTime.of(17, 0)));

        doctor.setAvailabilities(availabilities);
        return doctor;
    }

    private AvailabilityRequest createAvailabilityRequest(DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
        AvailabilityRequest availability = new AvailabilityRequest();
        availability.setDayOfWeek(dayOfWeek);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        return availability;
    }
}


