import { ObjectManagementNavV2 } from './v2';

type ObjectManagementNavProps = {
  children?: React.ReactNode;
};

/**
 * Bridge component to ObjectManagementNavV2
 * @param param0
 * @returns
 */
export function ObjectManagementNav({ ...props }: ObjectManagementNavProps) {
  return <ObjectManagementNavV2 {...props} />;
}
