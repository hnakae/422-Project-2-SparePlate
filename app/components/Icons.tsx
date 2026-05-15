import React from 'react';

interface IconProps {
  size?: number;
  sw?: number;
  fill?: string;
  style?: React.CSSProperties;
  className?: string;
}

function SPIcon({ d, size = 16, sw = 1.8, fill, style, className }: IconProps & { d: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill || 'none'}
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      {d}
    </svg>
  );
}

export const Icons = {
  Search:   (p: IconProps) => <SPIcon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>} />,
  Plus:     (p: IconProps) => <SPIcon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  Map:      (p: IconProps) => <SPIcon {...p} d={<><path d="M9 4l-6 3v13l6-3 6 3 6-3V4l-6 3-6-3z"/><path d="M9 4v13M15 7v13"/></>} />,
  List:     (p: IconProps) => <SPIcon {...p} d={<><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>} />,
  Bell:     (p: IconProps) => <SPIcon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  Clock:    (p: IconProps) => <SPIcon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  Pin:      (p: IconProps) => <SPIcon {...p} d={<><path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>} />,
  Leaf:     (p: IconProps) => <SPIcon {...p} d={<><path d="M11 20A7 7 0 0 1 4 13c0-6 5-9 13-9 0 6-3 13-9 13-3 0-4-3-4-4"/><path d="M2 22c4-7 8-8 10-9"/></>} />,
  Filter:   (p: IconProps) => <SPIcon {...p} d={<><path d="M4 5h16l-6 8v6l-4-2v-4z"/></>} />,
  Check:    (p: IconProps) => <SPIcon {...p} d={<><path d="M5 12l4 4L19 7"/></>} />,
  X:        (p: IconProps) => <SPIcon {...p} d={<><path d="M6 6l12 12M6 18L18 6"/></>} />,
  ChevronR: (p: IconProps) => <SPIcon {...p} d={<><path d="M9 6l6 6-6 6"/></>} />,
  ChevronD: (p: IconProps) => <SPIcon {...p} d={<><path d="M6 9l6 6 6-6"/></>} />,
  Arrow:    (p: IconProps) => <SPIcon {...p} d={<><path d="M5 12h14M13 6l6 6-6 6"/></>} />,
  Heart:    (p: IconProps) => <SPIcon {...p} d={<><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"/></>} />,
  Box:      (p: IconProps) => <SPIcon {...p} d={<><path d="M21 8l-9 4-9-4 9-4 9 4z"/><path d="M3 8v8l9 4 9-4V8"/></>} />,
  Dollar:   (p: IconProps) => <SPIcon {...p} d={<><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />,
  Nav:      (p: IconProps) => <SPIcon {...p} d={<><path d="M3 11l18-8-8 18-2-8-8-2z"/></>} />,
  User:     (p: IconProps) => <SPIcon {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></>} />,
  Truck:    (p: IconProps) => <SPIcon {...p} d={<><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>} />,
  Share:    (p: IconProps) => <SPIcon {...p} d={<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></>} />,
  Trend:    (p: IconProps) => <SPIcon {...p} d={<><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>} />,
  Edit:     (p: IconProps) => <SPIcon {...p} d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>} />,
  Sparkle:  (p: IconProps) => <SPIcon {...p} d={<><path d="M12 3l1.8 4.8L18 9.5l-4.2 1.7L12 16l-1.8-4.8L6 9.5l4.2-1.7z"/></>} />,
  Phone:    (p: IconProps) => <SPIcon {...p} d={<><path d="M22 17v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 17z"/></>} />,
};
