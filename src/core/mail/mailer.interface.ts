export interface MailData {
  to: string | string[];
  from?: string; // Optional: "from" email address
  subject: string;
  template: string; // e.g., 'otp', 'welcome'
  context: {
    [key: string]: any;
  };
}
