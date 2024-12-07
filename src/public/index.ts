import { Config, Connection } from 'src/services/api';

/**
 * Contains all the features to be exported out of the library
 */
export * from '../context/AmpersandContextProvider';
export * from '../components/Configure';
export * from '../components/Connect/ConnectProvider';
export * from '../hooks/useIsIntegrationInstalled';

// Exported types which are helpful for builders
export { FieldMapping } from 'src/components/Configure/content/fields/FieldMappings';
export type {
  Connection,
  Config,
};
