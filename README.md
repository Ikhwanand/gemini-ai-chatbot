# Gemini AI Chatbot 🤖💬

## Project Overview

Gemini AI Chatbot is an advanced, interactive web application that leverages Google's Generative AI to provide intelligent conversational experiences. The application features multiple modes of interaction, including standard chat, streaming responses, and web search capabilities.

## 🌟 Features

- **AI-Powered Conversations**: Utilize Google's Gemini AI for intelligent responses
- **Streaming Mode**: Real-time message generation
- **Web Search Integration**: Instant web search capabilities
- **Arxiv Research Search**: Academic research information retrieval
- **Modern, Responsive UI**: Clean and intuitive user interface
- **Error Handling**: Robust error management and logging

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- FontAwesome Icons
- CSS3 with modern layout techniques

### Backend
- Python
- Flask
- Google Generative AI
- Phi AI Framework
- Google Search API
- Arxiv Toolkit

## 📦 Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Google API Key

## 🚀 Installation

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/ikhwanand/gemini-ai-chatbot.git
cd gemini-ai-chatbot/project/backend
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Configure environment variables
- Create a `.env` file
- Add your Google API Key:
```
GOOGLE_API_KEY=your_google_api_key_here
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

## 🔧 Running the Application

### Start Backend
```bash
cd backend
python app.py
```

### Start Frontend
```bash
cd frontend
npm start
```

## 🌈 Usage Modes

1. **Standard Chat**: Default conversational mode
2. **Streaming Mode**: Toggle for real-time response generation
3. **Web Search Mode**: Perform instant web searches
4. **Arxiv Research Mode**: Search academic research papers

## 🔒 Security Notes

- Never commit sensitive API keys to version control
- Use environment variables for configuration
- Implement proper CORS and security headers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by Ikhwananda**