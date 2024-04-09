export interface FirstProps {
  color: string;
}

export default function First(props: FirstProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="LAST">
        <mask
          id="mask0_866_12009"
          mask="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect
            id="Rectangle 5173"
            width="24"
            height="24"
            transform="matrix(-1 0 0 1 24 0)"
            fill="#D9D9D9"
          />
        </mask>
        <g mask="url(#mask0_866_12009)">
          <g id="Group 370053">
            <path
              id="Vector"
              d="M16 18L10 12L16 6"
              stroke={props.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M7 18V12V6"
              stroke={props.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
