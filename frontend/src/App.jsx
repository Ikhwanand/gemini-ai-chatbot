import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import Header from './components/Header';
import ConversationDisplayArea from './components/ConversationDisplayArea';
import MessageInput from './components/MessageInput';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const abortControllerRef = useRef(null);

  const toggleStreaming = useCallback(async () => {
    try {
      console.log('Attempting to toggle streaming:', !isStreaming);
      const response = await axios.post('http://localhost:9000/toggle-stream', { 
        streaming: !isStreaming 
      });
      console.log('Toggle stream response:', response.data);
      setIsStreaming(response.data.streaming);
    } catch (error) {
      console.error('Error toggling streaming:', error);
      alert(`Failed to toggle streaming: ${error.message}`);
    }
  }, [isStreaming]);

  const toggleWebSearch = useCallback(async () => {
    setIsWebSearch(prev => !prev);
  }, []);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    const newMessage = { text: userMessage, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setStreamingResponse('');

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      let assistantMessage;

      if (isWebSearch) {
        // Web search logic
        const response = await axios.post('http://localhost:9000/search', { 
          message: userMessage 
        });
        assistantMessage = { 
          text: response.data.message, 
          sender: 'assistant' 
        };
      } else if (isStreaming) {
        // Streaming logic
        const response = await fetch('http://localhost:9000/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat: userMessage,
            history: messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            }))
          }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          setStreamingResponse(prev => prev + chunk);
        }

        // Add the complete streaming response to messages
        assistantMessage = { 
          text: streamingResponse, 
          sender: 'assistant' 
        };
      } else {
        // Non-streaming logic
        const response = await axios.post('http://localhost:9000/chat', { 
          message: userMessage 
        });
        assistantMessage = { 
          text: response.data.message, 
          sender: 'assistant' 
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        const errorMessage = { 
          text: `Oops! Something went wrong: ${error.message}`, 
          sender: 'assistant' 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  }, [isStreaming, isWebSearch, messages, streamingResponse]);

  return (
    <div className="app-container">
      <Header 
        isStreaming={isStreaming} 
        onToggleStreaming={toggleStreaming}
        isWebSearch={isWebSearch}
        onToggleWebSearch={toggleWebSearch}
      />
      <ConversationDisplayArea 
        messages={messages} 
        isLoading={isLoading}
        streamingResponse={streamingResponse}
        isStreaming={isStreaming}
      />
      <MessageInput 
        onSendMessage={sendMessage} 
        disabled={isLoading} 
      />
    </div>
  );
}

export default App;