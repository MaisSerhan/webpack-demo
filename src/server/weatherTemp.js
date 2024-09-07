// I use Weatherbit API to get the weather data  https://www.weatherbit.io/ with username: maissarhan
let axios = require("axios")

//I use th axios to get the data from URL
const weatherTemp = async(ma, is, days, key) => {
    //no day <0 so its not true input
    if(days < 0) {
            const errMsg = {
                message: "Date cannot be in the past",
                error: true
            }
            return errMsg
        }
 
    // The days are divided based on the data in the API.  
    //day in week
    if(days > 0 && days <= 7) {
        const {data} = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${is}&lon=${ma}&units=M&key=${key}`)
        console.log("first done");
        const {weather , temp} = data.data[data.data.length -1];
        const {description} = weather;
        const wethData = {description, temp}
        console.log(wethData);
        console.log("second done");
        return wethData
        
    }else if (days > 7){
        //large than 1 week
        const {data} = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${is}&lon=${ma}&units=M&days=${Rdays}&key=${key}`)
        console.log("third done");
        const {weather , temp, app_max_temp, app_min_temp} = data.data[data.data.length -1];
        const {description} = weather;
        const wethData = {description, temp, app_max_temp, app_min_temp}
        console.log("fourth done");
        return wethData
    }
}


module.exports = {
    weatherTemp
}