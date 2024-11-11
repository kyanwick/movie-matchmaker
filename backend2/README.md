# Movie Matchmaker - Personalized Movie Recommendations

A full-stack web application that provides personalized movie recommendations based on user preferences using The Movie Database (TMDb) API. Built with React, Express.js, MongoDB, and Tailwind CSS.

![Movie Recommendation App](./screenshots/app-preview.png)

## 🌟 Features

- **Personalized Questionnaire**: Interactive survey to understand user preferences
- **Smart Recommendations**: Leverages TMDb API to suggest movies based on user tastes
- **Preference Learning**: Stores and learns from user preferences over time
- **Responsive Design**: Full mobile and desktop support

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TMDb API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kyanwick/movie-matchmaker
cd movie-recommendation-system
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:

Create `.env` files in both client and server directories:

```env
# Server .env
MONGODB_URI=your_mongodb_uri
TMDB_API_KEY=your_tmdb_api_key
PORT=5000

# Client .env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development servers:
```bash
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend
cd client
npm start
```

The app should now be running at `http://localhost:3000`

## 🔧 Technologies Used

### Frontend
- React
- Tailwind CSS
- Axios
- React Router

### Backend
- Express.js
- MongoDB
- Mongoose
- TMDb API

## 🔒 Environment Variables

### Server
- `MONGODB_URI` - MongoDB connection string
- `TMDB_API_KEY` - TMDb API key
- `PORT` - Server port (default: 5000)

### Client
- `REACT_APP_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDb API](https://developers.themoviedb.org/3) for providing movie data
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React App](https://create-react-app.dev/) for the project bootstrap
