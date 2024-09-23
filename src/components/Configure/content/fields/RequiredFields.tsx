import { Tag } from 'components/ui-base/Tag';
import { useProject } from 'context/ProjectContextProvider';

import { isIntegrationFieldMapping } from '../../utils';
import { useSelectedConfigureState } from '../useSelectedConfigureState';

import { FieldHeader } from './FieldHeader';

export function RequiredFields() {
  const { configureState, selectedObjectName } = useSelectedConfigureState();
  const { appName } = useProject();

  return (
    <>
      <FieldHeader string={`${appName} reads the following ${selectedObjectName} fields`} />
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem' }}>
        {configureState?.read?.requiredFields?.length
          ? (configureState.read?.requiredFields.map((field) => {
            if (!isIntegrationFieldMapping(field)) {
              return <Tag key={field.fieldName}>{field.displayName}</Tag>;
            }
            return null; // fallback for customed mapped fields
          }))
          : 'There are no required fields.'}
      </div>
    </>
  );
}
