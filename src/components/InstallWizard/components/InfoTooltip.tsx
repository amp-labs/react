import { InfoCircledIcon } from "@radix-ui/react-icons";

import styles from "./infoTooltip.module.css";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <span className={styles.trigger}>
      <InfoCircledIcon />
      <span className={styles.tooltip}>{text}</span>
    </span>
  );
}
