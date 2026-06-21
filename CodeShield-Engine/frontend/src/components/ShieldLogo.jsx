export default function ShieldLogo({ className = 'w-7 h-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2.5 4 5.5v5.2c0 4.7 3.2 8.9 8 10.3 4.8-1.4 8-5.6 8-10.3V5.5L12 2.5Z"
        fill="var(--shield-accent)"
        fillOpacity="0.12"
        stroke="var(--shield-accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m9 12.2 2.1 2.1L15.2 10"
        stroke="var(--shield-success)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
