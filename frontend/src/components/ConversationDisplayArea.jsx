import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function ConversationDisplayArea({ 
  messages, 
  isLoading, 
  streamingResponse, 
  isStreaming 
}) {
  const conversationEndRef = useRef(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamingResponse]);

  return (
    <div className="conversation-display">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.sender}`}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      ))}
      
      {isStreaming && streamingResponse && (
        <div className="message assistant streaming">
          <ReactMarkdown>{streamingResponse}</ReactMarkdown>
        </div>
      )}
      
      {isLoading && (
        <div className="message assistant loading">
          <FontAwesomeIcon icon={faSpinner} spin />
          <span style={{ marginLeft: '10px' }}>
            {isStreaming ? 'Streaming...' : 'Thinking...'}
          </span>
        </div>
      )}
      
      <div ref={conversationEndRef} />
    </div>
  );
}

export default ConversationDisplayArea;