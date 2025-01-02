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
        <img style={{ height: '.8em' }} src="https://res.cloudinary.com/dycvts6vp/image/upload/v1723671980/ampersand-logo-black_fwzpfw.svg" alt="Ampersand" />
      </a>
    </footer>
  );
}
