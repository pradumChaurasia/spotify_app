const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.post('/refresh',(req,res)=>{
    const refreshToken = req.body.refreshToken
    //console.log(refreshToken)
    const spotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '4e47dc3006a74ae6ada9f4a3e8671667',
        clientSecret : '1467e62a8ee64781aeb055fd4e53c060',
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data)=> {
          res.json({
              accessToken: data.body.access_token,
              expiresIn:data.body.expires_in,
          })
        }).catch((err)=>{
            console.log(err)
            res.sendStatus(400)
        })
})

app.post("/Login",(req,res)=>{

    const code = req.body.code


    const spotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '4e47dc3006a74ae6ada9f4a3e8671667',
        clientSecret : '1467e62a8ee64781aeb055fd4e53c060'
    })

    spotifyApi.authorizationCodeGrant(code).then(data=>{
        res.json({
            accessToken : data.body.access_token,
            refreshToken : data.body.refresh_token,
            expiresIn : data.body.expires_in
        })
    }).catch((err)=>{
        console.log(err)
        res.sendStatus(400)
    })
})


app.get('/lyrics', async (req,res)=>{
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics Found"
    res.json({lyrics})
})

app.listen(3001,()=>{
    console.log("server is running on port 3001")
})