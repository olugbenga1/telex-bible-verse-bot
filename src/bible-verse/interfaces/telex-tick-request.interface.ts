import { FetchBibleSettings } from './fetch-bible-settings.interface';

// }
export interface TelexTickRequest {
  return_url?: string;
  channel_id?: string;
  settings: FetchBibleSettings;
}
