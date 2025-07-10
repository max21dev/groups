export type RelayInformation = {
  name?: string;
  description?: string;
  banner?: string;
  icon?: string;
  pubkey?: string;
  contact?: string;
  supported_nips?: number[];
  software?: string;
  version?: string;
  privacy_policy?: string;
  terms_of_service?: string;
  limitation?: RelayLimitation;
  retention?: RelayRetention[];
  relay_countries?: string[];
  language_tags?: string[];
  tags?: string[];
  posting_policy?: string;
  payments_url?: string;
  fees?: RelayFees;
};

export type RelayLimitation = {
  max_message_length?: number;
  max_subscriptions?: number;
  max_limit?: number;
  max_subid_length?: number;
  max_event_tags?: number;
  max_content_length?: number;
  min_pow_difficulty?: number;
  auth_required?: boolean;
  payment_required?: boolean;
  restricted_writes?: boolean;
  created_at_lower_limit?: number;
  created_at_upper_limit?: number;
  default_limit?: number;
};

export type RelayRetention = {
  kinds?: (number | [number, number])[];
  time?: number;
  count?: number;
};

export type RelayFees = {
  admission?: RelayFee[];
  subscription?: RelayFee[];
  publication?: RelayFee[];
};

export type RelayFee = {
  amount: number;
  unit: string;
  period?: number;
  kinds?: number[];
};
