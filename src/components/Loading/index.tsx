import { isChakraRemoved } from '../ui-base/constant';

import { LoadingIcon } from './LoadingIcon';

import classes from './style.module.css';

/**
 * supported after removing chakra-ui
 * @returns
 */
function Loading() {
  return (
    <span className={classes.loader} />
  );
}

/**
 * replaces LoadingIcon with a simple spinner centered in div
 * @returns
 */
export function LoadingCentered() {
  if (isChakraRemoved) {
    return (
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        marginTop: '20%',
        marginBottom: '20%',
      }}
      >
        <Loading />
      </div>
    );
  }

  return <LoadingIcon />;
}
