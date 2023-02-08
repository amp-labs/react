import { SourceList, IntegrationSource } from '../components/types/configTypes';

/* eslint-disable-next-line */
export const findSourceFromList = (integrationName: string, sourceList: SourceList) => {
  return sourceList.find((s: IntegrationSource) => s.name === integrationName);
};
