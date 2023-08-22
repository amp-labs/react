import { useContext } from 'react';

import { ProjectIDContext } from '../components/AmpersandProvider/AmpersandProvider';

export function useProjectID() {
  const projectID = useContext(ProjectIDContext);

  if (projectID === null) {
    throw new Error('useProjectID must be used within a AmpersandProvider');
  }

  return projectID;
}
