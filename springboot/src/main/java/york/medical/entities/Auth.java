package york.medical.entities;

import lombok.EqualsAndHashCode;
import york.medical.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Auth")
@Data
@EqualsAndHashCode(callSuper = true)
public class Auth extends Base {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String oktaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
