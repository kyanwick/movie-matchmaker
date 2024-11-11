import { useState } from "react";
import axios from "axios";

const AddMovie = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState([]);
  const [director, setDirector] = useState("");
  const [rating, setRating] = useState(0);
  const [poster, setPoster] = useState("");

  const saveMovie = async () => {
    try {
      await axios.post("http://localhost:5000/api/movies/movies", {
        title,
        genre,
        director,
        rating,
        poster,
      });
      alert("Movie saved!");
    } catch (error) {
      alert("Failed to save movie");
    }
  };

  return (
    <div>
      {/* Add input fields for movie title, genre, director, rating, and poster */}
      <button onClick={saveMovie}>Add Movie</button>
    </div>
  );
};

export default AddMovie;
