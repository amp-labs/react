import { Divider } from '@chakra-ui/react';

import { NavObjectItem } from './NavObjectItem';

export const OTHER_CONST = 'other';

export function OtherTab() {
  return (
    <>
      <Divider marginY={3} />
      <NavObjectItem
        key="other-write"
        objectName={OTHER_CONST}
        completed={false}
      />
    </>

  );
}
