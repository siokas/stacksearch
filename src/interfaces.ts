export interface APIStackExchange {
  items: Array<StackExchangeQuestion | StackExchangeAnswer>;
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
}

export interface StackExchangeQuestion {
  tags: Array<string>;
  owner: StackExchangeOwner;
  is_answered: boolean;
  view_count: number;
  answer_count: number;
  score: number;
  last_activity_date: number;
  creation_date: number;
  question_id: number;
  link: string;
  title: string;
}

export interface StackExchangeAnswer {
  owner: StackExchangeOwner;
  is_accepted: boolean;
  view_count: number;
  answer_count: number;
  score: number;
  last_activity_date: number;
  creation_date: number;
  answer_id: number;
  question_id: number;
  body_markdown: string;
  link: string;
  title: string;
  body: string;
}

interface StackExchangeOwner {
  reputation: number;
  user_id: number;
  user_type: string;
  accept_rate: number;
  profile_image: string;
  display_name: string;
  link: string;
}
