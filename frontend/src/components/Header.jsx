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
        <h1>
          <FontAwesomeIcon icon={faRobot} />
          Gemini AI
          <FontAwesomeIcon icon={faBrain} />
        </h1>
        <div className="header-toggles">
          <div className="streaming-toggle">
            <span>Stream Response</span>
            <button 
              onClick={onToggleStreaming} 
              className="toggle-button"
            >
              <FontAwesomeIcon 
                icon={isStreaming ? faToggleOn : faToggleOff} 
                color={isStreaming ? '#4a90e2' : 'gray'} 
                size="2x" 
              />
            </button>
          </div>
          <div className="websearch-toggle">
            <span>Web Search</span>
            <button 
              onClick={onToggleWebSearch} 
              className="toggle-button"
            >
              <FontAwesomeIcon 
                icon={isWebSearch ? faSearch : faSearch} 
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