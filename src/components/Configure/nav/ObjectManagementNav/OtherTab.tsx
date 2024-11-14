import { Divider } from 'components/ui-base/Divider';

import { OTHER_CONST } from './constant';
import { NavObjectItem } from './NavObjectItem';

type OtherTabProps = {
  pending?: boolean,
  completed: boolean,
  displayName?: 'Other' | 'Write',
};

/**
 * @deprecated remove this component when the chakra migration is done
 * @param param0
 * @returns
 */
export function OtherTab({ pending, completed, displayName }: OtherTabProps) {
  return (
    <>
      <Divider style={{ margin: '1rem 0' }} />
      <NavObjectItem
        key="other-write"
        objectName={OTHER_CONST}
        completed={completed}
        pending={pending}
        displayName={displayName}
      />
    </>

  );
}
