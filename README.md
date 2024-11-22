# PlayWave Backend  

PlayWave is a backend-focused video hosting platform built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**. It provides secure user authentication, video upload functionality, and features such as liking videos, commenting with replies, managing subscriptions, and a tweet-like system for user updates.  

## Features  
- **User Authentication**: Secure login and signup with JWT.  
- **Video Management**: Upload and manage videos with metadata stored in MongoDB.  
- **Like Videos**: Users can like videos to show appreciation.  
- **Comment System**: Add comments and reply to other users' comments.  
- **Subscriptions**: Manage subscriptions to receive updates from favorite users.  
- **Tweet-Like Feature**: Share short updates with followers.  

## Technology Stack  
### Backend:  
- **Node.js**: Server-side JavaScript runtime.  
- **Express.js**: Web application framework for building APIs.  
- **MongoDB**: NoSQL database for scalable data storage.  
- **Mongoose**: ODM for MongoDB to handle data modeling.  

### Security:  
- **JWT**: Secure user authentication and authorization.  

## Setup and Installation  

### Prerequisites  
- **Node.js** installed on your system.  
- **MongoDB** server running locally or on the cloud.
## Installation  

### Prerequisites  
- **Node.js**: Ensure you have Node.js installed on your system.  
- **MongoDB**: Have a running MongoDB instance (locally or in the cloud).  

### Steps to Install  

1. **Clone the Repository**  
   Clone the repository to your local machine using the following command:  
   ```bash
   git clone https://github.com/dimpleranapb/playwave-backend.git
   cd backend
2. **Install Dependencies**
Navigate to the project directory and install the required Node.js packages:
   ```bash
   npm install

3. **Set Up Environment Variables**
Create a .env file in the root directory of the project and configure the following variables:
   ```bash
   PORT=8000
   MONGODB_URL=mongodb+srv://your_username:your_password@cluster0.mongodb.net
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4. **Start the Development Server**
Launch the server in development mode using:
   ```bash
   npm run dev
   
5. **Test the APIs**
Use a tool like Postman or cURL to test the available API endpoints.

Your backend server should now be running at http://localhost:8000 (or the port specified in your .env file).
