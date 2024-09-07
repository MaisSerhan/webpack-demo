// use the Pixabay API to get the city Image with pixabay_key = 45693118-0a3272e83c5eb6d16ce5febf6
const axios = require("axios")


const getCityPic = async(city, key) => {
    const {data} = await axios.get(`https://pixabay.com/api/?key=${key}&q=${city}&image_type=photo`)
    const image =await data.hits[0]? await data.hits[0].webformatURL: "https://source.unsplash.com/random/640x480?city,morning,night?sig=1"
    if(image){
   // now i will send an object with single property image
   return {image}
    }
}

module.exports = {
    getCityPic
}
