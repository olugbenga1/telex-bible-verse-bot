interface TelexSuccessResponse {
  success: true;
}

interface TelexErrorResponse {
  success: false;
  message: string;
}

export type TelexResponse = TelexSuccessResponse | TelexErrorResponse;
