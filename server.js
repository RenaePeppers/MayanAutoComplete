/* const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectId} = require('mongodb')  //need object id pulled for this so its different from before
require('dotenv').config() //allows us to use .env file to obscure credentials
const PORT = 8000

let db,                             //here we are setting up variables, database name
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection


MongoClient.connect(dbConnectionStr)  //tells it to connect to this cluster etc in Mongo
  .then(client => {
    console.log(`Connected to database`)
    db = client.db(dbName)   //after connected set name
    collection = db.collection('movies')    //so go to sample_mflix, then go down to movies
  })

  //install middleware
  app.use(express.urlencoded({extended :true}))
  app.use(express.json())
  app.use(cors())

  //create apps

  //this get request brings back an array of possible titles to pick from
  app.get("/search", async (request, response) => {   //when user types in client side, it hits this server code
    try {
        let result = await collection.aggregate([
            {
                "$search" :{                               //$means its a mongo command
                    "autocomplete":  {                    //mongo can also to wildcard and partial match searches, etc
                        "query" :`${request.query.query}`,             // 
                        "path" : "title",     //this links to html title labels?
                        "fuzzy" :{             //doesn't have to match title exactly
                            "maxEdits" :2,   //user can make 2 character errors and still get match
                            "prefixLength" : 3   // user has to type 3 characters before search begins
                        }
                    }
                }
            }
        ]).toArray() //what comes back from mongo gets dumped into an array
        response.send(result)  //names the result from query 'result'
    } catch (error) {
        response.status(500).send({message:error.message})   //this one sends back a message as an object
        console.log(error)
    }
  })

  //this next get occurs when I pick an option from the possible titles that the previous get provided.
app.get("/get/:id", async (request, response) => {          ///:id is a parameter that we are passing in
    try {
        let result = await collection.findOne({       //hey mongo, find this single item
            "_id":  ObjectId(request.params.id)         //this is a database object _id.  I am passing in the object id  
        })  
        response.send(result)   //send the information back to my app
        }catch (error) {
        response.status(500).send({message:error.message})   //this one sends back a message as an object
          }
  })                                       



  //set up port to allow apps to connect to server
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  }) */


  const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectId } = require('mongodb')
const { response } = require('express')
const { request } = require('http')
require('dotenv').config()
const PORT = 8000

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to database`)
        db = client.db(dbName)
        collection = db.collection('movies')
    })

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())

app.get("/search", async (request,response) => {
    try {
        let result = await collection.aggregate([
            {
                "$search" : {
                    "autocomplete" : {
                        "query": `${request.query.query}`,
                        "path": "title",
                        "fuzzy": {
                            "maxEdits":2,
                            "prefixLength": 3
                        }
                    }
                }
            }
        ]).toArray()
        //console.log(result)
        response.send(result)
    } catch (error) {
        response.status(500).send({message: error.message})
        //console.log(error)
    }
})

app.get("/get/:id", async (request, response) => {
    try {
        let result = await collection.findOne({
            "_id" : ObjectId(request.params.id)
        })
        response.send(result)
    } catch (error) {
        response.status(500).send({message: error.message})
    }
}
)

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running.`)
})

//THIS IS THE INDEX TO APPLY TO MONGODB MOVIES COLLECTION
// {
//     "mappings": {
//         "dynamic": false,
//         "fields": {
//             "title": [
//                 {
//                     "foldDiacritics": false,
//                     "maxGrams": 7,
//                     "minGrams": 3,
//                     "tokenization": "edgeGram",
//                     "type": "autocomplete"
//                 }
//             ]
//         }
//     }
// }
