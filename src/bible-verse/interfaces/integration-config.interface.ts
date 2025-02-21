export interface IntegrationConfig {
  data: {
    date: {
      created_at: string;
      updated_at: string;
    };
    descriptions: {
      app_description: string;
      app_logo: string;
      app_name: string;
      app_url: string;
      background_color: string;
    };
    integration_category: string;
    integration_type: string;
    is_active: boolean;
    output: [{ label: string; value: true }];
    key_features: [string, string, string, string];
    permissions: object;
    settings: [
      {
        label: string;
        type: string;
        required: true;
        default: string;
        options: string[];
      },
      {
        label: string;
        type: string;
        required: true;
        default: string;
        options: string[];
      },
      {
        label: string;
        type: string;
        required: true;
        default: string;
        options: string[];
      },
    ];
    tick_url: string;
    target_url: null;
  };
}
