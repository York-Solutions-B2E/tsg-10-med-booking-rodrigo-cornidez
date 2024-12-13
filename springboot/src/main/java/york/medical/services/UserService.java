package york.medical.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import york.medical.dtos.requests.UserRequest;
import york.medical.entities.Auth;
import york.medical.entities.Patient;
import york.medical.enums.Role;
import york.medical.exceptions.ResourceNotFoundException;
import york.medical.repositories.AuthRepository;
import york.medical.repositories.PatientRepository;

@Service
public class UserService {

    private final AuthRepository authRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public UserService(AuthRepository authRepository, PatientRepository patientRepository) {
        this.authRepository = authRepository;
        this.patientRepository = patientRepository;
    }

    public Patient getPatientByOktaId(String oktaId) {
        Auth auth = authRepository.findByOktaId(oktaId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found for OKTA ID: " + oktaId));

        return patientRepository.findByAuth_OktaId(auth.getOktaId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient data not found for OKTA ID: " + oktaId));
    }

    @Transactional
    public Patient createPatientProfile(UserRequest userRequest) {
        // Fetch or create the Auth record for the current user
        Auth auth = authRepository.findByOktaId(userRequest.getOktaId())
                .orElseGet(() -> {
                    Auth newAuth = new Auth();
                    newAuth.setOktaId(userRequest.getOktaId());
                    newAuth.setRole(Role.PATIENT);
                    return authRepository.save(newAuth);
                });

        // Check if the user is an admin
        if (auth.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Admins do not require a patient profile.");
        }

        // Retrieve or create the Patient profile
        return patientRepository.findByAuth_OktaId(auth.getOktaId())
                .orElseGet(() -> {
                    Patient newPatient = new Patient();
                    newPatient.setAuth(auth);
                    newPatient.setFirstName(userRequest.getFirstName());
                    newPatient.setLastName(userRequest.getLastName());
                    newPatient.setDob(userRequest.getDob());
                    return patientRepository.save(newPatient);
                });
    }
}
