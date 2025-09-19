interface Props {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}

const BannerCircle = ({
  height = 312,
  width = 497,
  color = '#EDF5C7',
  className,
}: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={width}
    height={height}
    viewBox="0 0 497 312"
    fill="none"
    preserveAspectRatio="none"
  >
    <path
      fill={color}
      d="M0 24C0 10.745 10.745 0 24 0h450.513c12.649 0 23.084 9.83 22.41 22.46-1.064 19.961-5.216 48.275-19.423 63.54-47 50.5-26.5 77.5-5.5 148.5S430.5 312 430.5 312H24c-13.255 0-24-10.745-24-24V24Z"
    />
  </svg>
);

export default BannerCircle;
