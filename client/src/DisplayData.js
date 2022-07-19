import React, { useState } from 'react'
import { useQuery, useLazyQuery, gql, useMutation } from '@apollo/client';


const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            age
            username
        }
    }
`
const QUERY_MOVIES = gql`
    query GetMovies {
        movies {
            name
            yearOfPublication
        }
    }
`

const GET_MOVIE_BY_NAME = gql`
    query movie($name: String!) {
        movie(name: $name) {
            name
            yearOfPublication
        }
    }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input){
      name
      id
    }
  }
`

export const DisplayData = () => {

  // MovieStates
  const [movieSearched, setMovieSearched] = useState("");

  // UserStates
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  // Apollo Hooks
  const { data: userData, loading: usersLoading, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_MOVIES);
  const [
    fetchMovie, 
    { data: movieSearchedData, error: movieError }
  ] = useLazyQuery(GET_MOVIE_BY_NAME);
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  
  // UX
  if (usersLoading) {
    return <h1>Data is loading</h1>;
  }
  if (movieError) {
    console.log(JSON.stringify(movieError, null, 2));
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="age"
          onChange={(e) => {
            setAge(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="nationality"
          onChange={(e) => {
            setNationality(e.target.value.toUpperCase());
          }}
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });

            refetch();
          }}
        >
          Create User
        </button>
      </div>
      {userData &&
        userData.users.map((user) => {
          return (
            <div>
              <h1>Name: {user.name}</h1>
              <h3>Username: {user.username}</h3>
            </div>
          );
        })}
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div>
              <h1>Name: {movie.name}</h1>
            </div>
          );
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(e) => {
            setMovieSearched(e.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          {" "}
          Fetch Data
        </button>
      </div>
      <div>
        {movieSearchedData && (
          <div>
            <h1>Movie Name: {movieSearchedData.movie.name}</h1>
            <h3>Year: {movieSearchedData.movie.yearOfPublication}</h3>
          </div>
        )}
        {movieError && <h1> There was an error fetching the data</h1>}
      </div>
    </div>
  );
}
