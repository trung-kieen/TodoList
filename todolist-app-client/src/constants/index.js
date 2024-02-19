export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
export const ACCESS_TOKEN = 'accessToken';

export const POLL_LIST_SIZE = 30;
export const MAX_CHOICES = 6;
export const POLL_QUESTION_MAX_LENGTH = 140;
export const POLL_CHOICE_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;
export const APP_TITLE = 'Todo App';

export const NOTIFICATION_CONFIG = {
  placement: 'topRight',
  top: 70,
  duration: 3,
}
export const DEFAULT_PAGE = {
  tasks: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  last: true,
  isLoading: false,
  show: false,
};

export const DEMO_PAGE = {
  tasks: [{ id: 1, title: "Get up early", note: "before 10pm", completed: true },
  { id: 2, title: "Learn new language", note: "have a good plan", completed: false }],
  page: 1,
  size: 10,
  totalElements: 2,
  totalPages: 1,
  last: true,
  isLoading: false
}

export const EMPTY_TASK = {
  id: null,
  title: "Default task title",
  note: "Default task note",
  due: null,
  priority: "1",
  completed: false,
}

