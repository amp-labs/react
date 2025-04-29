import classes from "./divider.module.css";

export function Divider({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <hr
      className={
        className ? `${classes.divider} ${className}` : classes.divider
      }
      style={style}
    />
  );
}
