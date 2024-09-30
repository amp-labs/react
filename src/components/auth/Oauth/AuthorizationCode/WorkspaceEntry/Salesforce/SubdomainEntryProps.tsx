export const SALESFORCE_HELP_URL = 'https://help.salesforce.com/s/articleView?id=sf.faq_domain_name_what.htm&type=5';

export type SubdomainEntryProps = {
  handleSubmit: () => void;
  setWorkspace: (workspace: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};
