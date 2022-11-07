import React, { FC } from 'react'

export type IconProps = {
  size?: string
  fill?: string
  className?: string
}
export type IconOnOffProps = {
  size?: string
  fill?: string
  on?: boolean
  className?: string
}

export const Headset: FC<IconOnOffProps> = ({
  size = '24px',
  fill = 'currentColor',
  on = true,
  className = ''
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    fill={fill}
    className={className}
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    {on
      ? (
        <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      )
      : (
        <path d="M12 4c3.87 0 7 3.13 7 7v2h-2.92L21 17.92V11c0-4.97-4.03-9-9-9-1.95 0-3.76.62-5.23 1.68l1.44 1.44C9.3 4.41 10.6 4 12 4zM2.27 1.72L1 3l3.33 3.32C3.49 7.68 3 9.29 3 11v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-1.17.29-2.26.79-3.22L15 17v4h3c.3 0 .59-.06.86-.14L21 23l1.27-1.27-20-20.01z" />
      )
    }
  </svg>
)
export const Mic: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
  </svg>
)

export const Edit: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size || '24px'}
    height={size || '24px'}
    viewBox="0 0 24 24"
    fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path className="bg-gray-40 rounded" xmlns="http://www.w3.org/2000/svg" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
)

export const Broadcast: FC<IconOnOffProps> = ({
  size = '24px',
  fill = 'currentColor',
  on = true,
  className = ''
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill}>
    <rect fill="none" height="24" width="24" />
    {on
      ? (
        <path d="M7.76,16.24C6.67,15.16,6,13.66,6,12s0.67-3.16,1.76-4.24l1.42,1.42C8.45,9.9,8,10.9,8,12c0,1.1,0.45,2.1,1.17,2.83 L7.76,16.24z M16.24,16.24C17.33,15.16,18,13.66,18,12s-0.67-3.16-1.76-4.24l-1.42,1.42C15.55,9.9,16,10.9,16,12 c0,1.1-0.45,2.1-1.17,2.83L16.24,16.24z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z M20,12 c0,2.21-0.9,4.21-2.35,5.65l1.42,1.42C20.88,17.26,22,14.76,22,12s-1.12-5.26-2.93-7.07l-1.42,1.42C19.1,7.79,20,9.79,20,12z M6.35,6.35L4.93,4.93C3.12,6.74,2,9.24,2,12s1.12,5.26,2.93,7.07l1.42-1.42C4.9,16.21,4,14.21,4,12S4.9,7.79,6.35,6.35z" />
      )
      : (
        <path d="M8.14,10.96C8.05,11.29,8,11.64,8,12c0,1.1,0.45,2.1,1.17,2.83l-1.42,1.42C6.67,15.16,6,13.66,6,12 c0-0.93,0.21-1.8,0.58-2.59L5.11,7.94C4.4,9.13,4,10.52,4,12c0,2.21,0.9,4.21,2.35,5.65l-1.42,1.42C3.12,17.26,2,14.76,2,12 c0-2.04,0.61-3.93,1.66-5.51L1.39,4.22l1.41-1.41l18.38,18.38l-1.41,1.41L8.14,10.96z M17.42,14.59C17.79,13.8,18,12.93,18,12 c0-1.66-0.67-3.16-1.76-4.24l-1.42,1.42C15.55,9.9,16,10.9,16,12c0,0.36-0.05,0.71-0.14,1.04L17.42,14.59z M20,12 c0,1.48-0.4,2.87-1.11,4.06l1.45,1.45C21.39,15.93,22,14.04,22,12c0-2.76-1.12-5.26-2.93-7.07l-1.42,1.42C19.1,7.79,20,9.79,20,12z" />
      )
    }
  </svg>
)

export const Clear: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)
export const Play: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
)

export const Pause: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </svg>
)
export const Loop: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
  </svg>
)
export const Stop: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M6 6h12v12H6z" />
  </svg>
)
export const Next: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
)
export const Prev: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
)

export const DragHandle: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
)

export const Levels: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} transform='rotate(270)' className={className}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
  </svg>
)
export const List: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <path d="M14,10H3v2h11V10z M14,6H3v2h11V6z M18,14v-4h-2v4h-4v2h4v4h2v-4h4v-2H18z M3,16h7v-2H3V16z" />
    </g>
  </svg>
)

export const KeyArrowDown: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0V0z" fill="none" /><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
)
export const Delete: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
)
export const Fullscreen: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <path d="M0 0h24v24H0z" fill="none" /><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
)
export const Download: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill} className={className}>
    <g><rect fill="none" height="24" width="24" /></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z" /></g>
  </svg>
)

export const Pending: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg"
    className={className}
    enableBackground="new 0 0 24 24"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    fill={fill}
  >
    <g>
      <rect fill="none" height="24" width="24" /></g><g><path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M7,13.5c-0.83,0-1.5-0.67-1.5-1.5 c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5C8.5,12.83,7.83,13.5,7,13.5z M12,13.5c-0.83,0-1.5-0.67-1.5-1.5 c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5C13.5,12.83,12.83,13.5,12,13.5z M17,13.5c-0.83,0-1.5-0.67-1.5-1.5 c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5C18.5,12.83,17.83,13.5,17,13.5z" />
    </g>
  </svg>
)
export const DoubleArrow: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} enableBackground="new 0 0 24 24" height={size || '24px'} viewBox="0 0 24 24" width={size || '24px'} fill={fill}>
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <g>
        <polygon points="15.5,5 11,5 16,12 11,19 15.5,19 20.5,12" />
        <polygon points="8.5,5 4,5 9,12 4,19 8.5,19 13.5,12" />
      </g>
    </g>
  </svg>
)
export const DoNotDisturb: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    height={size}
    width={size}
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  ><g>
      <path d="M0,0h24v24H0V0z" fill="none" />
    </g>
    <g><g><g>
      <path
        d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M4,12c0-4.4,3.6-8,8-8c1.8,0,3.5,0.6,4.9,1.7L5.7,16.9 C4.6,15.5,4,13.8,4,12z M12,20c-1.8,0-3.5-0.6-4.9-1.7L18.3,7.1C19.4,8.5,20,10.2,20,12C20,16.4,16.4,20,12,20z" />
    </g></g></g>
  </svg>
)

export const ChevronLeft: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} height={size} viewBox="0 0 24 24" width={size} fill={fill}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
)

export const ChevronRight: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} height={size} viewBox="0 0 24 24" width={size} fill={fill}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
)

export const ArrowLeft: FC<IconProps> = ({
  size = '24px',
  fill = 'currentColor',
  className = ''
}: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg"
  className={className}
  height={size}
  width={size}
  viewBox="0 0 40 40"
  fill={fill}>
  <path d="M24 40 8 24 24 8l2.1 2.1-12.4 12.4H40v3H13.7l12.4 12.4Z"/>
  </svg>
)

const Default = {
  Headset,
  Mic,
  Edit,
  Broadcast,
  Clear,
  Pause,
  Play,
  Loop,
  Stop,
  Next,
  Prev,
  DragHandle,
  Fullscreen,
  Download,
  Levels,
  List,
  KeyArrowDown,
  Delete,
  Pending,
  DoubleArrow,
  DoNotDisturb,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
}
export default Default
