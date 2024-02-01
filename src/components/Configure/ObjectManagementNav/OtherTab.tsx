import { Divider } from '@chakra-ui/react';

import { NavObjectItem } from './NavObjectItem';

export const OTHER_CONST = 'other';

type OtherTabProps = {
  pending?: boolean,
  completed: boolean,
  displayName?: 'other' | 'write',
};

export function OtherTab({ pending, completed, displayName }: OtherTabProps) {
  return (
    <>
      <Divider marginY={3} />
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
