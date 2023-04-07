import { createContext, useReducer, type Reducer } from 'react';

// Define the type for the message object
type MessageType = {
  id: number;
  text: string;
  type: string;
};
// Define the type for the state object
type MessagesBubbles = {
  messages: MessageType[];
};
// Define the action types
enum ActionType {
  ADD_MESSAGE = 'ADD_MESSAGE',
  REMOVE_MESSAGE = 'REMOVE_MESSAGE',
}

// Define the action interfaces
interface AddMessageAction {
  type: ActionType.ADD_MESSAGE;
  payload: {
    text: string;
    type: string;
  };
}

interface RemoveMessageAction {
  type: ActionType.REMOVE_MESSAGE;
  payload: number;
}

type Action = AddMessageAction | RemoveMessageAction;

// Define the initial state object
const initialState: MessagesBubbles = {
  messages: [],
};

// Define the reducer function
const MessagesReducer: Reducer<MessagesBubbles, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.ADD_MESSAGE: {
      return {
        ...state,
        messages: [
          ...state.messages,
          { ...action.payload, id: state.messages.length },
        ],
      };
    }
    case ActionType.REMOVE_MESSAGE: {
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== action.payload),
      };
    }
    default:
      return state;
  }
};

// Create the context
export const ChatContext = createContext<{
  stateMessages: MessagesBubbles;
  dispatchMessage: React.Dispatch<Action>;
}>({
  stateMessages: initialState,
  dispatchMessage: () => undefined,
});

const ChatBubblesProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateMessages, dispatchMessage] = useReducer(
    MessagesReducer,
    initialState
  );
  return (
    <ChatContext.Provider value={{ stateMessages, dispatchMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatBubblesProvider;
