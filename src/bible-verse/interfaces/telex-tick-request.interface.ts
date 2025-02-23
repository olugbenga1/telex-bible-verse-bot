import { FetchVerseSettings } from './fetch-verse-settings.interface';

// }
export interface TelexTickRequest {
  return_url?: string;
  channel_id?: string;
  settings: FetchVerseSettings;
}
