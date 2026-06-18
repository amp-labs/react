import { ApiProblemParts, parseApiProblemMessage } from "src/utils/apiProblem";

import classes from "./problemMessage.module.css";

type ProblemMessageProps =
  | { message: string; detail?: never; remedy?: never }
  | { message?: never; detail: string; remedy?: string };

function getParts(props: ProblemMessageProps): ApiProblemParts {
  if ("message" in props && props.message !== undefined) {
    return parseApiProblemMessage(props.message);
  }
  return { detail: props.detail, remedy: props.remedy };
}

export function ProblemMessage(props: ProblemMessageProps) {
  const { detail, remedy } = getParts(props);

  return (
    <div className={classes.root}>
      <p className={classes.detail}>{detail}</p>
      {remedy && (
        <div className={classes.remedyBlock}>
          <span className={classes.remedyLabel}>How to fix</span>
          <p className={classes.remedy}>{remedy}</p>
        </div>
      )}
    </div>
  );
}
