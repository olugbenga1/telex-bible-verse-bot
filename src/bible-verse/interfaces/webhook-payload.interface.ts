export interface WebhookPayload {
  event_name: string;
  username: string;
  status: 'success' | 'failure';
  message: string;
}
