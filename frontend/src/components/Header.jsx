import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faBrain, 
  faToggleOn, 
  faToggleOff, 
  faSearch 
} from '@fortawesome/free-solid-svg-icons';

function Header({ 
  isStreaming, 
  onToggleStreaming, 
  isWebSearch, 
  onToggleWebSearch 
}) {
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-title">
          <FontAwesomeIcon icon={faRobot} className="header-icon robot-icon" />
          <h1>Gemini AI</h1>
          <FontAwesomeIcon icon={faBrain} className="header-icon brain-icon" />
        </div>
        <div className="header-toggles">
          <div className="streaming-toggle toggle-group">
            <span>Stream Response</span>
            <button 
              onClick={onToggleStreaming} 
              className="toggle-button"
              aria-label="Toggle Streaming"
            >
              <FontAwesomeIcon 
                icon={isStreaming ? faToggleOn : faToggleOff} 
                color={isStreaming ? '#4a90e2' : 'gray'} 
                size="2x" 
              />
            </button>
          </div>
          <div className="websearch-toggle toggle-group">
            <span>Web Search</span>
            <button 
              onClick={onToggleWebSearch} 
              className="toggle-button"
              aria-label="Toggle Web Search"
            >
              <FontAwesomeIcon 
                icon={faSearch} 
                color={isWebSearch ? '#2ecc71' : 'gray'} 
                size="2x" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;