/**
 * given a list of keys and disqualifying keys,
 * return true if any of the disqualifying keys are found in the list of keys
 * @param keys
 * @param disqualifyingKeys
 * @returns
 */
export function hasDisqualifyingKey(keys: string[], disqualifyingKeys: string[]): boolean {
  return keys.reduce((hasDisqualifying: boolean, key: string) => {
    if (hasDisqualifying) {
      // If disqualifying key is found, return true immediately
      return true;
    }
    // Check if the current key is in the disqualifyingKeys array
    return disqualifyingKeys.includes(key);
  }, false);
}
