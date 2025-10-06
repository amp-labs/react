import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import classes from "./objectErrorAlert.module.css";

interface ObjectErrorAlertProps {
  error: string;
}

export function ObjectErrorAlert({ error }: ObjectErrorAlertProps) {
  return (
    <div className={classes.errorAlert}>
      <div className={classes.errorHeader}>
        <ExclamationTriangleIcon className={classes.errorIcon} />
        <span className={classes.errorTitle}>Unable to load object</span>
      </div>
      <div className={classes.errorMessage}>{error}</div>
    </div>
  );
}
