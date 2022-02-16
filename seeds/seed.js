const mongoose = require('mongoose')
const {descriptors, places} =require('./place')
const location =require('./location')
const Campground = require('../model/mongo')

mongoose.connect('mongodb://localhost:27017/yelpCamp')
.then(console.log('Connected to the yelpCamp database'))
.catch(err=>console.log('Error'))

const place = arr=>arr[Math.floor(Math.random()*arr.length)];

const func = async ()=>{
    await Campground.deleteMany({})
    for(let i = 0; i<50; i++)
    {
        const price = Math.floor(Math.random()*20)+10
        const random = Math.floor(Math.random()*1000)
        const camp = new Campground({
            author:'620b49c8781c5066ff8581a8',
            name:`${place(descriptors)} ${place(places)}`,
            location: `${location[random].city}, ${location[random].state}`,
            image:'https://source.unsplash.com/800x450/?camping',
            price,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta doloremque, corrupti dolorum in unde temporibus ex voluptates possimus officia repellendus iste deserunt aut quo minus sapiente ipsum earum dignissimos molestias officiis! Iste tenetur voluptas ratione distinctio nemo vero doloremque consequatur, sunt omnis alias quidem nobis optio eveniet possimus labore reprehenderit!'
        })
        await camp.save()
    }
}
func().then(d=>mongoose.connection.close())