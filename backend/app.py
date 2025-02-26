# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
from flask import (
    Flask,
    request,
    Response,
    stream_with_context
)
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import logging
import json
from phi.agent import Agent, RunResponse
from phi.tools.googlesearch import GoogleSearch
from phi.model.google import Gemini
from phi.tools.arxiv_toolkit import ArxivToolkit

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from a .env file located in the same directory.
load_dotenv()

# Initialize a Flask application. Flask is used to create and manage the web server.
app = Flask(__name__)

# Apply CORS to the Flask app which allows it to accept requests from all domains.
# This is especially useful during development and testing.
CORS(app)

# WARNING: Do not share code with you API key hard coded in it.
# Configure the Google Generative AI's Google API key obtained
# from the environment variable. This key authenticates requests to the Gemini API.
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize the generative model with the specified model name.
# This model will be used to process user inputs and generate responses.
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash"
)

@app.route('/chat', methods=['POST'])
def chat():
    """Processes user input and returns AI-generated responses.

    This function handles POST requests to the '/chat' endpoint. It expects a JSON payload
    containing a user message. It returns the AI's response as a JSON object.

    Returns:
        A JSON object with a key "message" that contains the AI-generated response.
    """
    # Parse the incoming JSON data into variables.
    data = request.json
    msg = data.get('message', '')

    if not msg:
        return {"message": "No message provided"}, 400

    # Send the user input to the model and get the response.
    response = model.generate_content(msg)

    return {"message": response.text}

@app.route("/stream", methods=["POST"])
def stream():
    """Streams AI responses for real-time chat interactions.

    This function initiates a streaming session with the Gemini AI model,
    continuously sending user inputs and streaming back the responses. It handles
    POST requests to the '/stream' endpoint with a JSON payload similar to the
    '/chat' endpoint.

    Args:
        None (uses Flask `request` object to access POST data)

    Returns:
        A Flask `Response` object that streams the AI-generated responses.
    """
    def generate():
        try:
            # Parse the incoming JSON data
            data = request.json
            logger.info(f"Received streaming request: {data}")

            # Extract message and chat history
            msg = data.get('chat', '')
            chat_history = data.get('history', [])

            # Validate input
            if not msg:
                logger.warning("Empty message received for streaming")
                yield json.dumps({"error": "Empty message"})
                return

            # Start a chat session with the model
            chat_session = model.start_chat(history=chat_history)

            # Stream the response
            response = chat_session.send_message(msg, stream=True)

            # Yield each chunk of the response
            full_response = ""
            for chunk in response:
                chunk_text = chunk.text
                full_response += chunk_text
                yield chunk_text
            
            logger.info(f"Completed streaming response: {full_response}")

        except Exception as e:
            # Comprehensive error logging
            logger.error(f"Streaming error: {e}", exc_info=True)
            yield json.dumps({"error": str(e)})

    # Use stream_with_context to ensure proper streaming
    return Response(
        stream_with_context(generate()), 
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )

@app.route('/toggle-stream', methods=['POST'])
def toggle_stream():
    """
    Toggle streaming mode for the chat application.
    """
    try:
        data = request.json
        is_streaming = data.get('streaming', False)
        logger.info(f"Streaming mode toggled: {is_streaming}")
        return {'streaming': is_streaming}
    except Exception as e:
        logger.error(f"Error in toggle_stream: {e}")
        return {'error': str(e)}, 500



@app.route('/search', methods=['POST'])
def search():

    # Parse the incoming JSON data into variables.
    data = request.json
    msg = data.get('message', '')

    if not msg:
        return {"message": "No message provided"}, 400
    

    agent = Agent(
        model=Gemini(name='gemini-1.5-flash', api_key=os.getenv("GOOGLE_API_KEY")),
        tools=[GoogleSearch(), ArxivToolkit()],
        description="You are a helpful assistant that helps users find information on the web.",
        instructions=[
            "Use the GoogleSearch tool to search for information on the web.",
            "Use the ArxivToolkit tool to search for information on the arxiv.org.",
            "Return the link of the source document or information.",
            "If no information is found, return 'No information found.'",
        ],
        show_tool_calls=True,
        debug_mode=True,
    )


    response: RunResponse = agent.run(f"{msg}")
    content = response.content 
    
    return {"message": content}, 200

    


# Configure the server to run on port 9000.
if __name__ == '__main__':
    app.run(port=9000, debug=True)