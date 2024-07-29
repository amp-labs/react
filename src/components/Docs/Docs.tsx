export function DocsURL({ url, children }: { url: string | undefined, children: React.ReactNode; }) {
  if (!url) {
    return null;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
