import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '~/context/ChatBubbles';
import Drawer from '~/layout/Drawer';

// type MessageType = {
//   id: number;
//   text: string;
//   type: string;
// };

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { stateMessages } = useContext(ChatContext);
  //const [messages, setMessages] = useState<MessageType[] | []>([]);
  const [isMessagesShown, setMessagesShown] = useState(false);

  useEffect(() => {
    //setMessages(stateMessages.messages.splice);

    setMessagesShown(true);
    setTimeout(() => {
      setMessagesShown(false);
    }, 5000);
  }, [stateMessages]);

  return (
    <>
      <Drawer>{children}</Drawer>
      <div
        className="chat gap-4 chat-end absolute bottom-20 right-8"
        style={{
          display: isMessagesShown ? '' : 'none',
        }}
      >
        {stateMessages.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble chat-bubble-${message.type} transition-opacity duration-700`}
            style={{
              opacity: isMessagesShown ? '50' : '0',
              display: isMessagesShown ? 'hidden' : '',
            }}
          >
            {message.text}.
          </div>
        ))}
      </div>
      {/* This ones are for preloading the chat-bubble themes */}
      <div className="hidden">
        <div className="chat-bubble-error">Teeeest.</div>
        <div className="chat-bubble-warning">Teeeest.</div>
        <div className="chat-bubble-primary">Teeeest.</div>
        <div className="chat-bubble-secondary">Teeeest.</div>
        <div className="chat-bubble-accent">Teeeest.</div>
        <div className="chat-bubble-info">Teeeest.</div>
        <div className="chat-bubble-success">Teeeest.</div>
      </div>
    </>
  );
};

export default Layout;

/* 
Here's an example of how to create a reducer function in React with TypeScript and a global context to display error messages in chat bubbles:

import React, { createContext, useReducer, Reducer } from 'react';

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
  payload: MessageType;
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
const reducer: Reducer<MessagesBubbles, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.ADD_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, action.payload],
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
  state: MessagesBubbles;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

// Create the provider component
export const ChatProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
Copy Code
In this example, we have defined a message object that has an id, text, and type, and a state object that contains an array of messages. We then define two action interfaces that correspond to adding and removing messages from the state object.

We define a reducer function that handles these actions, updating the state object accordingly. We also create a context with the state and dispatch function, and a provider component that wraps the rest of our application.

To display the chat bubbles with a smooth transition effect, you could use a CSS animation or a library like react-transition-group. When a new message is added to the state object, you could trigger the transition effect, and then remove the message from the state object after a few seconds to hide the chat bubble.

Here's an example of how you could use the ChatProvider and ChatContext in another component to add a message:

import React, { useContext, useState } from 'react';
import { ChatContext } from './chat-context';

const AddMessage: React.FC = () => {
  const { dispatch } = useContext(ChatContext);
  const [text, setText] = useState('');

  const handleAddMessage = () => {
    if (text.trim()) {
      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: {
          id: Date.now(),
          text,
          type: 'error',
        },
      });
      setText('');
      setTimeout(() => {
        dispatch({
          type: ActionType.REMOVE_MESSAGE,
          payload: Date.now(),
        });
      }, 3000);
    }
  };

  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAddMessage}>Add</button>
    </div>
  );
};
Copy Code
In this example, we import the ChatContext from the chat-context file and use the useContext hook to get access to the dispatch function. We define some state for the text input and handle adding a new message to the state object by dispatching the ADD_MESSAGE action. We then clear the text input and set a timeout to remove the message after a few seconds by dispatching the REMOVE_MESSAGE action with the same id.
*/
