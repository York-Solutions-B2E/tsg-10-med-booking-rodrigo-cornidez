import React from 'react';
import Marquee from './Marquee';

const specialties = [
  { icon: '❤️', specialty: 'Cardiology' },
  { icon: '👶', specialty: 'Pediatrics' },
  { icon: '🌞', specialty: 'Dermatology' },
  { icon: '🦴', specialty: 'Orthopedics' },
  { icon: '🧠', specialty: 'Neurology' },
];

/**
 * Displays a scrolling marquee showcasing the specialties offered.
 *
 * @component
 * @returns {JSX.Element} The SpecialtiesBanner component.
 */
export default function SpecialtiesBanner() {
  return (
    <section className="py-2">
      {/* Marquee Component */}
      <Marquee items={specialties} />
    </section>
  );
}
