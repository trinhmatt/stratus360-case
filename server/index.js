const   express = require('express'),
        cors = require('cors'),
        path = require('path'),
        db = require('./db.js'),
        axios = require('axios'),
        constants = require('./constants/consts'),
        app = express();

let HTTP_PORT = process.env.PORT || 8080;

//Enable cross origin
app.use(cors());
app.use(express.urlencoded({extended: true}));

// app.get('/latest', (req, res) => {
//     const resouceURL = constants.URLs.xkcdRoot + constants.URLs.xkcdComicPath;
//     axios.get(resouceURL)
//         .then( response => res.send(response.data))
//         .catch( err => res.status(500).send(err))
// })

app.get('test', (req, res) => {
    
    // const resourceURL = req.params.comicToFetch === "latest" ? constants.URLs.xkcdRoot + constants.URLs.xkcdComicPath 
    //                     : constants.URLs.xkcdRoot + `/${req.params.comicToFetch}` + constants.URLs.xkcdComicPath;
    axios.get("https://xkcd.com/2532/info.0.json")
        .then( response => {
            console.log('here')
            res.send(response.data)
        })
        .catch( err => res.status(500).send(err))
})

app.get('/:comicToFetch', (req, res) => {
    const fetchingLatest = req.params.comicToFetch === "latest"
    const resourceURL = fetchingLatest ? constants.URLs.xkcdRoot + constants.URLs.xkcdComicPath 
                        : constants.URLs.xkcdRoot + `/${req.params.comicToFetch}` + constants.URLs.xkcdComicPath;
    if (fetchingLatest) {
        axios.get(resourceURL)
            .then( response => {
                db.updateViewCount(response.data.num)
                    .then( viewCountObj => {
                        response.data.numberOfViews = viewCountObj.numberOfViews;
                        res.send(response.data);
                    })
                    .catch( err => console.log(err))
                
            })
            .catch( err => res.status(500).send(err))
    } else {
        axios.get(resourceURL)
            .then( response => {
                let requestedComic = response.data;
                // I need to fetch the latest comic because otherwise I have no way of knowing which comic number is the most recent
                // The front end needs the most recent number in order to render the "Next" button 
                const latestURL = constants.URLs.xkcdRoot + constants.URLs.xkcdComicPath 
                axios.get(latestURL)
                    .then( response => {
                        requestedComic.latestComicNumber = response.data.num;
                        db.updateViewCount(requestedComic.num)
                            .then( viewCountObj => {
                                requestedComic.numberOfViews = viewCountObj.numberOfViews;
                                res.send(requestedComic);
                            })
                            .catch( err => console.log(err))
                        
                    })
                    .catch( err => res.status(500).send(err));
            })
            .catch( err => res.status(500).send(err))
    }
    
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
})

db.initialize().then( () => {
    app.listen(HTTP_PORT, () => {
        console.log("Server running on port: ", HTTP_PORT);
    })
})