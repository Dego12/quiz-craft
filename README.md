📘 QuizCraft — Real-Time Quiz Application

QuizCraft is a real-time web application designed for learning, entertainment, and interactive sessions—similar to platforms like Kahoot. It enables users to create, host, and participate in quizzes with instant feedback and competitive scoring.

🚀 Features
📝 Quiz Creation

Create quizzes with multiple questions and answer options.

Customize question sets and quiz sessions.

Manage quizzes through a secure interface.

👥 User Authentication

Secure login with email and password.

Server-side validation of user identity.

Session protection through JWT (JSON Web Tokens).

⚡ Real-Time Participation

Participants join live sessions using a unique PIN.

Questions are displayed in real-time, and users respond simultaneously.

Immediate evaluation of answers.

🏆 Scoring & Leaderboard

Scoring formula based on correctness and response time:

P(t) = round( (1 - t / Ts) * 1000 )


Leaderboard automatically updates to reflect player performance.

Encourages competition and engagement.

🧱 Architecture Overview

QuizCraft uses a client–server architecture supported by modern web technologies to enable reliable real-time communication.

🔧 Backend

Handles game logic, data persistence, user flow, and quiz state management.

Ensures secure communication and data integrity.

💻 Frontend

Responsive, user-friendly interface designed for accessibility and clarity.

Works across major browsers including Chrome and Firefox.

🏗️ Tech Stack
Backend

C# / .NET Core
Uses an object-oriented, high-performance framework for building REST APIs.

ASP.NET Core

Controllers handle quiz operations and API endpoints.

Middleware validates user authentication and manages HTTP communication.

Database

Entity Framework Core
Manages data models and relationships using ORM principles.

SQL Server
Stores data such as quizzes, questions, users, and responses.

Includes:

Entities & relationships diagram

Migrations (Add-Migration, Update-Database)

Security

JWT-based authentication
Access tokens stored securely in browser cookies.

Password hashing and encrypted user data.

Middleware that validates tokens and prevents unauthorized access.

📊 Core Components
🎮 Server

Quiz logic execution

User state handling

Question delivery

Score tracking

🌐 Client

Displays the quiz UI

Sends user responses

Receives updates in real-time
