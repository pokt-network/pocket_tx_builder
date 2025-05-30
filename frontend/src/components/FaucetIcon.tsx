// FaucetIcon.tsx
import { JSX } from "solid-js";

/**
 * FaucetIcon - Modern SVG faucet icon for Pocket TX Builder
 *
 * Usage:
 *   <FaucetIcon />
 */
export default function FaucetIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      {/* Faucet body */}
      <rect x="4" y="10" width="16" height="4" rx="2" />
      {/* Faucet handle */}
      <rect x="10" y="4" width="4" height="4" rx="1" />
      {/* Water drops */}
      <path d="M12 14v4" />
      <circle cx="12" cy="20" r="1" />
    </svg>
  );
}
