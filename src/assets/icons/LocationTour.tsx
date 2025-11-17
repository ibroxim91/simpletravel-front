interface Props {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}

const LocationTour = ({
  height = 24,
  width = 24,
  color = '#EDF5C7',
  className,
}: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      fill={color}
      fillRule="evenodd"
      d="M9.93 1.667a6.593 6.593 0 0 0-6.596 6.591c0 1.3.384 2.572 1.106 3.654l3.571 5.357a2.39 2.39 0 0 0 3.978 0l3.571-5.357a6.587 6.587 0 0 0-2.095-9.304 6.602 6.602 0 0 0-3.395-.941h-.14Zm3.16 5.244a.833.833 0 0 1 0 1.178l-2.5 2.5a.833.833 0 0 1-1.18 0L7.745 8.923a.833.833 0 1 1 1.179-1.179L10 8.821l1.91-1.91a.833.833 0 0 1 1.18 0Z"
      clipRule="evenodd"
    />
  </svg>
);
export default LocationTour;
