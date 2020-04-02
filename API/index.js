var express = require('express')
var  app = express()
var cors = require('cors')

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'leaflet-plugin';
// Create a new MongoClient

// Use connect method to connect to the Server

var bodyParser = require('body-parser')
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

  

app.use(cors())



app.get('/data', async(req,res)=>{

    const client = new MongoClient(url);    
    client.connect(async function(err) {
        console.log("Connected successfully to DB");
      
        const db = client.db(dbName);      
        let markers = await db.collection('map').findOne({identity:'markers'})
        let lines = await db.collection('map').findOne({identity:'lines'})
        
        
        //console.log(markers)
        res.status(200).send({markers, lines})

        
      });
    

})


app.post('/data', async (req,res)=>{

	console.log(req.body)
    /** asignacion de variables */
    let markers={
        identity:'',
        markers:[]
    }
    markers.identity = 'markers'
    markers.markers = req.body.markers

    let lines = req.body.lines
    lines.identity = 'lines'

    console.log(markers)
    console.log(lines)


    /** manejo de la base de datos, actualizando markers */

    try {
        const client = new MongoClient(url);
        await client.connect(async function (err, client) {
            console.log("Connected correctly to server");

            const db = client.db(dbName);

            let markerFinded = await db.collection('map').findOne({ identity: 'markers' })
            if (markerFinded) {
                console.log(`encontrado markers`)
                let markerUpdated = await db.collection('map').replaceOne({ identity: 'markers' }, markers)
                if (markerUpdated) {
                    console.log(`actualizado markers`)
                }
            } else {
                let markersInsert = await db.collection('map').insertOne(markers)
                console.log(`insertado markers`)
            }



            let lineFinded = await db.collection('map').findOne({ identity: 'lines' })
            if (lineFinded) {
                console.log(`encontrado lines`)
                let lineUpdated = await db.collection('map').replaceOne({ identity: 'lines' }, lines)
                if (lineUpdated) {
                    console.log(`actualizado lines`)
                }
            } else {
                let linesInsert = await db.collection('map').insertOne(lines)
                console.log(`insertado lines`)
            }
        });
        res.status(200).send({state:'Data inserted successfully'})

    } catch (error) {
        res.status(500).send('Error updating the data, try again')
    }




})


app.listen(3000, ()=>{
    console.log(`api on port 3000`)
})
