export interface LastProp {
  color: string;
}

export default function Last(props: LastProp) {
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
          id="mask0_866_12029"
          mask="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect id="Rectangle 5173" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_866_12029)">
          <g id="Group 370053">
            <path
              id="Vector"
              d="M8 18L14 12L8 6"
              stroke={props.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M17 18V12V6"
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
