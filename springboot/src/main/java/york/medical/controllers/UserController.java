package york.medical.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import york.medical.dtos.requests.UserRequest;
import york.medical.entities.Patient;
import york.medical.exceptions.ResourceNotFoundException;
import york.medical.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    // Get Patient By Okta ID
    @GetMapping
    public ResponseEntity<Patient> getPatientByOktaId(@AuthenticationPrincipal OAuth2User user) {
        String oktaId = user.getAttribute("sub");
        Patient patient = userService.getPatientByOktaId(oktaId);
        return ResponseEntity.ok(patient);
    }

    // Create Patient
    @PostMapping
    public ResponseEntity<Patient> createPatientProfile(@Valid @RequestBody UserRequest userRequest, @AuthenticationPrincipal OAuth2User user) {
        userRequest.setOktaId((String) user.getAttributes().get("sub"));
        Patient patient = userService.createPatientProfile(userRequest);
        return new ResponseEntity<>(patient, HttpStatus.CREATED);
    }
}
