# Interview-Video-Analysis

A comprehensive platform for automated video interview analysis, designed to help both hiring companies and candidates in the interview process.

![System Architecture](hiring_dependency.png)

## Project Overview

Interview-Video-Analysis is a full-stack web application that automates the analysis of video interviews. The system uses machine learning to evaluate candidates based on facial expressions, speech patterns, and resume relevance to job descriptions. It provides a platform for companies to post job openings, schedule interviews, and analyze candidate performance, while also allowing candidates to apply for jobs, participate in interviews, and improve their interview skills.

## System Architecture

The application follows a client-server architecture:

- **Frontend**: React.js application with Redux for state management
- **Backend**: Python Flask server with various analysis modules
- **Database**: MongoDB for data persistence
- **ML Models**: Pre-trained models for emotion detection and speech analysis

## Features

### For Hiring Companies

- Post and manage job openings
- Schedule and conduct video interviews
- Analyze candidate performance through:
  - Facial emotion analysis
  - Speech pattern analysis
  - Resume-job description matching
- Review candidate profiles and interview recordings

### For Candidates

- Browse and apply for job openings
- Participate in video interviews
- View scheduled interviews
- Upload and manage resume
- Practice interview skills

## Core Technologies

### Backend

- **Python Flask**: Web server framework
- **OpenCV**: Computer vision for facial detection and analysis
- **Keras/TensorFlow**: Deep learning for emotion classification
- **Parselmouth**: Audio analysis for speech patterns
- **PyMongo**: MongoDB database integration
- **NLTK**: Natural language processing for text analysis

### Frontend

- **React.js**: UI framework
- **Redux**: State management
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API communication
- **WebRTC**: Real-time video capture and streaming

### Machine Learning Models

- **Emotion Detection**: Keras model trained on FER 2013 dataset
- **Speech Analysis**: Parselmouth library for tone analysis
- **Text Sentiment**: Analysis after stopword removal

## Modules

### Facial Emotion Analysis

- Uses a Keras model trained on FER 2013 data from Kaggle
- Detects emotions: Happy, Sad, Angry, Neutral, Surprised
- Provides frame-by-frame analysis of facial expressions

### Audio Tone Analysis

- Uses Parselmouth library for speech processing
- Analyzes speech speed (words per minute)
- Detects pauses, filler words, and speech patterns

### Text Sentiment Analysis

- Processes speech-to-text conversion
- Removes stopwords for more accurate analysis
- Evaluates sentiment and communication effectiveness

### Resume-Job Matching

- Compares candidate resume with job description
- Uses NLP techniques to calculate similarity score
- Helps assess candidate suitability for specific roles

## Installation and Setup

### Prerequisites

- Python 3.7+
- Node.js and npm
- MongoDB
- FFmpeg (for video processing)

### Backend Setup

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/Interview-Video-Analysis.git
   cd Interview-Video-Analysis/backend
   ```

2. Install Python dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Ensure MongoDB is running on your system

4. Start the Flask server:
   ```
   python server.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd ../frontend
   ```

2. Install Node.js dependencies:

   ```
   npm install
   ```

3. Start the React development server:

   ```
   npm start
   ```

4. Access the application at http://localhost:3000

## Usage

### Default Credentials

- **Candidate**:
  - Username: hari_vilas
  - Password: hari@123
- **Company 1**:
  - Username: company1
  - Password: comp1@123
- **Company 2**:
  - Username: company2
  - Password: comp2@123

### Workflow for Companies

1. Login using company credentials
2. Post job openings with detailed descriptions
3. Review candidate applications
4. Schedule interviews with candidates
5. Enable interviews when ready
6. Review and analyze interview recordings
7. Evaluate candidates based on analysis results

### Workflow for Candidates

1. Login using candidate credentials
2. Upload resume and complete profile
3. Browse and apply for job openings
4. Participate in scheduled interviews
5. Review interview status

## Future Improvements

- Improve model accuracy for emotion and speech analysis
- Add real-time feedback during interviews
- Implement more sophisticated NLP for resume analysis
- Enhance UI/UX for better user experience
- Add support for group interviews
- Implement more comprehensive analytics dashboard

## Applications

- Hiring companies can use this as a preliminary screening round before in-person interviews
- Candidates can practice and improve their interview skills
- Educational institutions can use it for interview preparation training
- HR departments can standardize their interview evaluation process

## Contributors

1. [Hari Vilas Panjwani](https://github.com/harivilasp)
2. [Ayush Kumar](https://github.com/ayush1920)
