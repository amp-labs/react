export interface NavObjectItemProps {
  objectName: string;
  completed: boolean;
  pending?: boolean;
  displayName?: string; // overrides objectName as the display name when present
}
