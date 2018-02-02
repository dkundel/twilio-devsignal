import { load as loadConfig } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  loadConfig();
}

export const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  SLACK_VERIFICATION_TOKEN,
  SLACK_TOKEN
} = process.env;
