import "./App.css";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import { useState, useEffect } from "react";
import Loginpage from "./components/login-page/login-page.jsx";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./config/firebase.js";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // Add state for the user's name

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    const CurrentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([CurrentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.error());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    // Clear information from local storage
    localStorage.removeItem("isLoggedIn");
    // Sign out the user from Firebase
    setCurrentWeather(null);
    setForecast(null);
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User signed in:", user.displayName);

        // Set the user's name in your component state
        setUserName(user.displayName);
        setIsLoggedIn(true);
      } else {
        // User is signed out
        console.log("User signed out");
        setUserName(""); // Clear the user's name in your component state
        setIsLoggedIn(false);
      }
    });

    // Cleanup the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  console.log(currentWeather);
  console.log(forecast);

  return (
    <div className="container">
      {isLoggedIn === false ? (
        <Loginpage setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <>
          <div className="welcome-section">
            <p className="welcome-message">Hello, {userName}! Welcome back!</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          <Search onSearchChange={handleOnSearchChange} />
          {currentWeather && <CurrentWeather data={currentWeather} />}
          {forecast && <Forecast data={forecast} />}
        </>
      )}
    </div>
  );
}

export default App;
