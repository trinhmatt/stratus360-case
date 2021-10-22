const   mongoose = require("mongoose"),
        viewsSchema = require("./schemas/views")
        dotenv = require("dotenv").config();

let Views = null;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.DB_CONNECTION_STRING);

        db.on("error", (err) => {
            reject(err);
        })

        db.once("open", () => {
            Views = db.model("views", viewsSchema.viewsSchema);
            console.log("Db running")
            resolve();
        })
    })
}

module.exports.updateViewCount = (comicNumber) => {
    return new Promise((resolve, reject) => {
        Views.findOne({comicNumber}).exec()
            .then( viewObj => {
                if (!viewObj) {
                    const initialViewObj = {comicNumber, numberOfViews: 1}
                    const newViewTableValue = new Views(initialViewObj);
                    newViewTableValue.save( (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(initialViewObj);
                        }
                    })
                } else {
                    viewObj.numberOfViews++;
                    viewObj.save();
                    resolve(viewObj);
                }
            })
            .catch( err => {
                console.log(err)
            })
    })
}