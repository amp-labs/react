import { getEnvVariable } from 'src/utils';

const VITE_SHOW_MANAGE_TABS = getEnvVariable('VITE_AMP_SHOW_MANAGE_TABS', false);
const NEXT_SHOW_MANAGE_TABS = getEnvVariable('NEXT_AMP_SHOW_MANAGE_TABS', false);
const REACT_APP_SHOW_MANAGE_TABS = getEnvVariable('REACT_APP_AMP_SHOW_MANAGE_TABS', false);

export const SHOW_MANAGE_TABS = !!VITE_SHOW_MANAGE_TABS || !!NEXT_SHOW_MANAGE_TABS || !!REACT_APP_SHOW_MANAGE_TABS;
