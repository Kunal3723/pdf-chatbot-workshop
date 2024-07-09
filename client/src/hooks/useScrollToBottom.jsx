import { useEffect, useRef } from 'react';

const useScrollToBottom = (dependencies = []) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, dependencies);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return messagesEndRef;
};

export default useScrollToBottom;
