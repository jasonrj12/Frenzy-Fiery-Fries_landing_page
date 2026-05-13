import React from "react";

export function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export function Icon({ name, className }) {
  const common = "inline-block";
  switch (name) {
    case "bolt":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M13 2 3 14h7l-1 8 12-14h-7l-1-6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "star":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3l2.6 5.6 6.1.7-4.5 4 1.3 6-5.5-3.1-5.5 3.1 1.3-6-4.5-4 6.1-.7L12 3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "clock":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pin":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 22s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "phone":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 3h4l2 5-3 2c1 2.8 3.2 5 6 6l2-3 5 2v4c0 1.1-.9 2-2 2C10.3 21 3 13.7 3 5c0-1.1.9-2 2-2h2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "menu":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "x":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2l1.4 4.7L18 8l-4.6 1.3L12 14l-1.4-4.7L6 8l4.6-1.3L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M19 12l.9 3 3.1.9-3.1.9L19 20l-.9-3.2L15 15.9l3.1-.9L19 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "home":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12h6v10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "utensils":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 2v20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ticket":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 0 0 4v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 0 0-4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 3v20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 4"
          />
        </svg>
      );
    case "chevron-down":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg
          className={classNames(common, className)}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
<path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.46 3.482 1.333 4.997L2 22l5.13-1.345A9.95 9.95 0 0 0 12.004 22c5.514 0 9.997-4.483 9.997-9.997S17.518 2.003 12.004 2.003zm0 18.17a8.14 8.14 0 0 1-4.15-1.136l-.298-.177-3.044.798.813-2.968-.194-.305a8.13 8.13 0 0 1-1.251-4.382c0-4.48 3.644-8.124 8.124-8.124 4.48 0 8.124 3.644 8.124 8.124 0 4.48-3.644 8.17-8.124 8.17z"/>
        </svg>
      );
    default:
      return null;
  }
}

