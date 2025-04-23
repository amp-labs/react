import { Tooltip } from 'react-tooltip';
import { TooltipIcon } from 'src/assets/TooltipIcon';

interface LabelTooltipProps {
  id: string;
  tooltipText: string;
}

export function LabelTooltip({ id, tooltipText }: LabelTooltipProps) {
  return (
    <>
      <span data-tooltip-id={id} style={{ maxWidth: '20rem' }}>
        {TooltipIcon()}
      </span>
      <Tooltip id={id} place="top" content={tooltipText} style={{ maxWidth: '30rem' }} />
    </>
  );
}
