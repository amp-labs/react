import { Divider } from 'src/components/ui-base/Divider';

interface FieldHeaderProps {
  string: string;
}

// fallback during migration away from chakra-ui, when variable is not defined
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-text-secondary').trim() || '#737373';

export function FieldHeader({ string }: FieldHeaderProps) {
  return (
    <div style={{
      display: 'flex', position: 'relative', paddingTop: '2rem', paddingBottom: '1rem',
    }}
    >
      <h3 style={{ color, fontSize: '1rem', fontWeight: '500' }}>{string}</h3>
      <div style={{
        display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center',
      }}
      >
        <Divider style={{ marginLeft: '1rem' }} />
      </div>
    </div>
  );
}
