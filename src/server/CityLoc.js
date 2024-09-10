
//use the geonames API for the travel data and city
const axios = require("axios")
//https://secure.geonames.org/searchJSON?q=Andorra&maxRows=1&username=maissarhan
const CityLoc = async(city, username) => {
    const {data} = await axios.get(`https://secure.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`)
    
    if(!data.geonames.length){
        const errMsg = {
            message: "No city with that name. Please make sure of your spelling",
            error: true
        }
        return errMsg
    }
    return data.geonames[0]
}

module.exports =  {CityLoc}