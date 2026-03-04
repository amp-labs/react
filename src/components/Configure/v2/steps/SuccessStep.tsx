import { SuccessCheckmarkIcon } from "assets/SuccessIcon";
import { Button } from "src/components/ui-base/Button";

import styles from "./successStep.module.css";

interface SuccessStepProps {
  onEditConfiguration?: () => void;
}

export function SuccessStep({ onEditConfiguration }: SuccessStepProps) {
  return (
    <div className={styles.container}>
      <SuccessCheckmarkIcon />
      <h2 className={styles.title}>Integration Installation Successful</h2>
      <p className={styles.description}>
        Your integration has been configured and is now active.
      </p>
      {onEditConfiguration && (
        <Button type="button" onClick={onEditConfiguration}>
          Edit Configuration
        </Button>
      )}
    </div>
  );
}
