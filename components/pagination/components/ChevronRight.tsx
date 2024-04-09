export interface ChevronRightProps {
  color: string;
}

export default function ChevronRight(props: ChevronRightProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="chevron-left">
        <path
          id="Vector"
          d="M9 18L15 12L9 6"
          stroke={props.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
