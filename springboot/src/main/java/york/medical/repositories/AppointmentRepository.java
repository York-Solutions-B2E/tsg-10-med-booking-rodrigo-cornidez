package york.medical.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import york.medical.entities.Appointment;
import york.medical.enums.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient_PatientId(Long patientId);
    List<Appointment> findByStatus(AppointmentStatus status);

    Optional<Object> findByPatient_PatientIdAndDoctor_DoctorIdAndDateAndStatusNot(Long patientId, Long doctorId, LocalDate date, AppointmentStatus appointmentStatus);

    long countByStatusNot(AppointmentStatus appointmentStatus);
}
