import { createStore } from 'redux';

// État initial
const initialState = {
  serverMessage: '',
  error: '',
  selectedDate: new Date(),
  selectedEmployee: '',
  employees: [],
  workSchedule: null,
  isMobile: window.innerWidth < 700,
};

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_SERVER_MESSAGE':
      return { ...state, serverMessage: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_SELECTED_EMPLOYEE':
      return { ...state, selectedEmployee: action.payload };
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    case 'SET_WORK_SCHEDULE':
      return { ...state, workSchedule: action.payload };
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;