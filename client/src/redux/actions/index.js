import axios from "axios";

export const getVideogames = () => {
    return async (dispatch) => {
        const videogames = await axios.get(`http://localhost:3001/videogames`);
        return dispatch({ type: "GET_VIDEOGAMES", payload: videogames.data });
    };
  };

