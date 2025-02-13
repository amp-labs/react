import { FieldMapping, FieldMappingEntry } from 'src/components/Configure/InstallIntegration';
import { Config, Connection } from 'src/services/api';

/**
 * Contains all the features to be exported out of the library
 */
export * from '../context/AmpersandContextProvider';
export * from '../components/Configure';
export * from '../components/Connect/ConnectProvider';
export * from '../hooks/useIsIntegrationInstalled';

/**
 *  Exported types which are helpful for builders
 */
export type {
  FieldMapping, // For defining dynamic mappings
  FieldMappingEntry, // For defining dynamic mappings
  Connection, // For ConnectProvider callbacks
  Config, // For InstallIntegration callbacks
};
