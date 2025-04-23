import { useState } from 'react';

import { Connection } from 'src/services/api';

import { Button } from '../ui-base/Button';

import { SHOW_UPDATE_CONNECTION } from './contant';
import { RemoveConnectionButton } from './RemoveConnectionButton';

export function ManageConnectionSection({
  resetComponent,
  onDisconnectSuccess,
}: {
  resetComponent: () => void;
  onDisconnectSuccess?: (connection: Connection) => void;
}) {
  const [showUpdateConnection, setShowUpdateConnection] = useState(false);

  if (!SHOW_UPDATE_CONNECTION) {
    return null;
  }

  return (
    <>

      {showUpdateConnection === false && (
        <>
          <h3>Manage connection</h3>
          <Button
            type="button"
            onClick={() => setShowUpdateConnection(true)}
            variant="ghost"
            style={{ fontSize: '13px' }}
          >
            Update connection
          </Button>
          <RemoveConnectionButton
            resetComponent={resetComponent}
            onDisconnectSuccess={onDisconnectSuccess}
            buttonText="Remove connection"
            buttonVariant="danger"
            buttonStyle={{ fontSize: '13px' }}
          />
        </>
      )}
      {showUpdateConnection === true && (
        <>
          <h3>Update connection</h3>
          <p>Update connection section</p>
        </>
      )}
    </>
  );
}
