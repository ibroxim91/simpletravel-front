interface Props {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}

const BannerCircleMobile = ({
  height = 312,
  width = 240,
  color = '#EDF5C7',
  className,
}: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={width}
    height={height}
    viewBox="0 0 312 240"
    fill="none"
    preserveAspectRatio="none"
  >
    <path
      fill={color}
      d="M16 240c-8.837 0-16-7.163-16-16V15.626C0 6.986 6.848-.066 15.488.031 35.23.25 68.85 1.83 86 9.534 157 41.427 186.5 22.28 244.5 14c46.977-6.706 62.137 9.402 66.203 15.768.991 1.55 1.297 3.391 1.297 5.232v189c0 8.837-7.163 16-16 16H16Z"
    />
  </svg>
);
export default BannerCircleMobile;
