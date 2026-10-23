import React from "react";

export function SvgIcon({ path, size = 16, color = "currentColor", style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
      {path}
    </svg>
  );
}

export const Icons = {
  User: ({ size = 16, color = "#FDE68A" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      }
    />
  ),
  Gender: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <circle cx="9" cy="9" r="5" />
          <line x1="13" y1="5" x2="20" y2="1" />
          <polyline points="15 1 20 1 20 6" />
          <line x1="9" y1="14" x2="9" y2="21" />
          <line x1="6" y1="18" x2="12" y2="18" />
        </>
      }
    />
  ),
  Calendar: ({ size = 16, color = "#FDE68A" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      }
    />
  ),
  Clock: ({ size = 16, color = "#FDE68A" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      }
    />
  ),
  Location: ({ size = 16, color = "#FDE68A" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      }
    />
  ),
  Compass: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </>
      }
    />
  ),
  Chart: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <polygon points="12 2 22 12 12 22 2 12" />
          <rect x="7" y="7" width="10" height="10" />
        </>
      }
    />
  ),
  Overview: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </>
      }
    />
  ),
  Planet: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <circle cx="12" cy="12" r="6" />
          <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-30 12 12)" />
        </>
      }
    />
  ),
  House: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      }
    />
  ),
  Shield: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </>
      }
    />
  ),
  Scale: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M16 16l3-8 3 8a3 3 0 0 1-6 0z" />
          <path d="M2 16l3-8 3 8a3 3 0 0 1-6 0z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h18" />
        </>
      }
    />
  ),
  Heart: ({ size = 16, color = "#F472B6" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </>
      }
    />
  ),
  Briefcase: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </>
      }
    />
  ),
  Gem: ({ size = 16, color = "#34D399" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M6 3h12l4 6-10 13L2 9z" />
          <path d="M11 3v6l-4 3" />
          <path d="M13 3v6l4 3" />
        </>
      }
    />
  ),
  Sun: ({ size = 16, color = "#FBBF24" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </>
      }
    />
  ),
  Moon: ({ size = 16, color = "#93C5FD" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </>
      }
    />
  ),
  Hourglass: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </>
      }
    />
  ),
  Flame: ({ size = 16, color = "#F97316" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </>
      }
    />
  ),
  BookOpen: ({ size = 16, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </>
      }
    />
  ),
  Sparkle: ({ size = 16, color = "#FDE68A" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </>
      }
    />
  ),
  Check: ({ size = 14, color = "#10B981" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <polyline points="20 6 9 17 4 12" />
        </>
      }
    />
  ),
  Download: ({ size = 16, color = "#0F0A1E" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </>
      }
    />
  ),
  ArrowRight: ({ size = 14, color = "#F59E0B" }) => (
    <SvgIcon
      size={size}
      color={color}
      path={
        <>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </>
      }
    />
  )
};
