import { IntegrationConfig, IntegrationSource, ObjectConfig } from "../../components/types/configTypes";
import { forEach, set } from 'lodash';

export const generateDefaultIntegrationConfig = (source: IntegrationSource): IntegrationConfig => {
  const config = {}
  
  forEach(source.objects, options => {
    const selectedOptionalFields = {};
    if (options.optionalFields) {
      forEach(options.optionalFields, opt => {
        set(selectedOptionalFields, opt.fieldName, opt.default || true);
      })
    }
    const toSet: ObjectConfig = {
      selectedOptionalFields: selectedOptionalFields,
      selectedFieldMapping: {},
    }
    set(config, options.name.objectName, toSet);
  })

  return config;
}
