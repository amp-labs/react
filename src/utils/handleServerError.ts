import { ResponseError } from '@generated/api/src';

/**
 * handles server error generated by sdk (Response Error) and calls setError callback if provided
 * @param error could be unknown error or ResponseError
 * @param setError callback to set error state
 */
export const handleServerError = async (error: any, setError?: (error: string) => void) => {
  if (error instanceof ResponseError) {
    const { status, statusText } = error.response;

    if (status === 500) {
      console.error('Internal Server Error (500):', statusText);
    } else if (status === 400) {
      console.error('Bad Request (400):', statusText);
    } else {
      console.error(`Error (${status}):`, statusText);
    }

    try {
      // make clone in case we want to read error response body multiple times
      const errorResponseClone = error.response.clone();
      const errorBody = await errorResponseClone.json(); // If the response body contains error details

      // https://github.com/amp-labs/openapi/blob/3bc3ab75c3071763e1117f697be3e0fcb636972c/problem/problem.yaml#L85
      // All errors returned by the Ampersand API conform to this format
      const errorMsg = errorBody?.causes?.join('\n') || errorBody?.detail;
      if (!errorMsg) {
        console.error('Unexpected error response:', errorBody);
      } else {
        console.error('[Error Message]', errorMsg);
        if (errorBody?.remedy) { console.error('[Remedy]', errorBody.remedy); }
      }

      if (setError) setError(errorMsg);
    } catch (e) {
      console.error('Error parsing error response body:', e); // the response body could already be parsed
    }
  } else {
    console.error('Unexpected error:', error.message);
  }
};
