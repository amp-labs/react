import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { FieldDefaultValueTable } from './FieldDefaultValueTable';

export function FieldDefaultValueMapping() {
  const {
    configureState,
  } = useSelectedConfigureState();

  const writeObjects = configureState?.write?.writeObjects;
  const selectedWriteObjects = configureState?.write?.selectedWriteObjects;
  const shouldRender = !!(writeObjects);

  return (
    shouldRender && (
    <>
      {writeObjects.map((field) => {
        // only render default value if the object has write access.
        // TODO: add check to hydrated revision: valueDefaults.allowAnyFields
        if (selectedWriteObjects?.[field.objectName]) {
          return (
            <>
              <FieldHeader string={`Defaults for ${field.displayName} `} />
              <FieldDefaultValueTable objectName={field.objectName} />
            </>
          );
        }
        return null;
      })}
    </>
    )
  );
}
