/**
 * Ampersand Logo in footer. Links to Ampersand website.
 * @returns
 */
export function AmpersandFooter() {
  return (
    <footer
      style={{
        backgroundColor: 'light-dark(#EFEFEF, #646266)',
        padding: '1em',
        fontSize: '0.8em',
        color: 'gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '0 0 4px 4px',
        gap: '0.4em',
      }}
    >
      <p style={{ color: 'light-dark(gray, #EFEFEF)' }}>Secured by</p>
      <a
        href="https://www.withampersand.com/"
        target="_blank"
        aria-label="Go to Ampersand"
        rel="noreferrer noopener"
      >
        <img style={{ height: '.8em' }} src="https://ampersand-website.vercel.app/logo-black.svg" alt="Ampersand" />
      </a>
    </footer>
  );
}
