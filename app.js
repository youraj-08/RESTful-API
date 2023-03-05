const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");






const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);





/////////////////////////////////////////// Requests targetting all Articles////////////////////////////////////



// Using HTTP verbs:

app.route("/articles")

    // 1) GET - Fetches all articles. (Read->CRUD)

    .get(async (req, res) => {
        try {
            const articles = await Article.find({});
            res.send(articles);
        }
        catch (err) { console.log(err); }
    })

    // 2) POST - Creates a new article. (Create->CRUD)

    .post(function (req, res) {

        const article1 = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article1.save().then(() => {
            console.log('Post added to DB.');
        })
            .catch(err => {
                // res.status(400).send("Unable to save post to database.");
                console.log(err + "Unable to save post to database.");
            });
    })

    // 3) DELETE - Deletes the article from DB. (Delete->CRUD)

    .delete(function (req, res) {
        Article.deleteMany({/*condition*/ }).then(() => {
            console.log('Post deleted from DB.');
        })
            .catch(err => {
                // res.status(400).send("Unable to save post to database.");
                console.log(err + "Unable delete from database.");
            });
    });



/////////////////////////////////////////// Requests targetting a single Articles////////////////////////////////////


app.route("/articles/:articleTitle")


.get(async (req, res) => {
    try {
        const articles = await Article.findOne({title: req.params.articleTitle});
        res.send(articles);
    }
    catch (err) { res.send (err + " No articles with matching title found"); }
});




app.listen(3000, function () {
    console.log("Server started on port 3000");
});