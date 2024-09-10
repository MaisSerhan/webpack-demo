import axios from "axios";
const form = document.querySelector("form"); //for submit 
const cityInp = document.querySelector("#city"); // to take city input
const dateInp = document.querySelector("#flightDate"); //to take  date input
const city_error = document.querySelector("#city_error"); // if the city error
const date_error = document.querySelector("#date_error");// if the date error

// step used in function used the js and api 
//1. when we submit first we check that true function work
//2. check the input is true and validate
//3. check the location is have in api
//4. check the date is true 
//5. if all data is true and valid in api take the data in api and show to user by export it 


const handleSubmit = async (e) => {
  e.preventDefault(); // when we input and want to submit

  //checking if the function is working fine
  console.log("Step 1: The function is triggered successfully");

  // validate form on the front-end side which is utterly important before calling the apis for better performance
  if(!valdate_Inp()){
    return;
  };

  console.log("Step 2: Inputs are validated");
  //get the location first and make sure call is successful
  const Location = await CityLoc();
  //failing call to location
  if (Location && Location.error) {
    //handling the error coming from the server-side
    city_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${Location.message}`;
    city_error.style.display = "block";
    return
  } else if (Location && !Location.error) {

    console.log("Step 3: City location is available in API");
    
    // Extract latitude, longitude, and city name
    const { lng, lat, name } = await Location;

    //get the date of the flight
    const date = dateInp.value;

    //user didn't input the date
    if (!date) {
      console.log("please enter the date");
      date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
      date_error.style.display = "block";
      return;
    }


    if (lng && lat) {
      // get remaining days before the flight
      //i need to calcualte remaining days
      const remainingDays = getRdays(date);
      console.log("Step 4: Date is valid");
      //get the weather data and consider sending the remaining days to know when
      //exactly should i get my data back.

      const weather = await getWeather(lng, lat, remainingDays);
      if(weather?.error) {
        date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weather.message}`;
        date_error.style.display = "block";
        return;
      }
      //get the picture of the place
      const pic = await CityPic(name);
      updateUI(remainingDays, name, pic, weather);
    }
  }
};

// this function to check the input data is vaild 
const valdate_Inp = () => {
  city_error.style.display = "none";
  date_error.style.display = "none";
  if(!cityInp.value){
    city_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>You need to enter the city`;
    city_error.style.display = "block";
    return false;
  }
  if(!dateInp.value){
    date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
    date_error.style.display = "block";
    return false;
  }
  if(getRdays(dateInp.value) < 0){
    date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Date cannot be in the past`;
    date_error.style.display = "block";
    return false;
  }
  city_error.style.display = "none";
  date_error.style.display = "none";

  return true
};

const CityLoc = async () => {
  try{
  if (cityInp.value) {
    const { data } = await axios.post("http://localhost:8000/getCity", form, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } else {
    city_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> This field cannot be left empty`;
    city_error.style.display = "block";
  }}
  catch(error){
    console.error("Error fetching city location:", error);
  }
};

// Fetch weather data based on location and remaining days
const getWeather = async (lng, lat, remainingDays) => {
  try {
    const { data } = await axios.post("http://localhost:8000/getWeather", { lng, lat, remainingDays });
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};
// Calculate remaining days to the flight
const getRemainingDays = (date) => {
  const today = new Date();
  const flightDate = new Date(date);
  const timeDiff = flightDate - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Get city picture from the API
const getCityPicture = async (cityName) => {
  try {
    const { data } = await axios.post("http://localhost:8000/CityPic", { city_name: cityName });
    return data.image;
  } catch (error) {
    console.error("Error fetching city picture:", error);
  }
};

// Update the UI with flight and weather information
const updateUI = (remainingDays, city, picture, weather) => {
  document.querySelector("#Rdays").innerHTML = `Your trip starts in ${remainingDays} days from now`;
  document.querySelector(".cityName").innerHTML = `Location: ${city}`;
  document.querySelector(".weather").innerHTML = `Weather: ${weather.description}`;
  document.querySelector(".temp").innerHTML = `Temperature: ${weather.temp}°C`;

  if (remainingDays > 7) {
    document.querySelector(".max-temp").innerHTML = `Max Temp: ${weather.app_max_temp}°C`;
    document.querySelector(".min-temp").innerHTML = `Min Temp: ${weather.app_min_temp}°C`;
  }

  document.querySelector(".cityPic").innerHTML = `<img src="${picture}" alt="City image">`;
  document.querySelector(".flight_data").style.display = "block";
};

// Export the handleSubmit function for use
export { handleSubmit };