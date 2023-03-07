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
            res.send('Post deleted from DB.');
        })
            .catch(err => {
                // res.status(400).send("Unable to save post to database.");
                res.send(err + "Unable delete from database.");
            });
    });



/////////////////////////////////////////// Requests targetting a single Articles ////////////////////////////////////


app.route("/articles/:articleTitle")


    // 1) GET - Fetches a specific article. (Read->CRUD)

    .get(async (req, res) => {
        try {
            const articles = await Article.findOne({ title: req.params.articleTitle });
            res.send(articles);
        }
        catch (err) { res.send(err + " No articles with matching title found"); }
    })


    // 2) PUT - Updates a specific Article. (Update->CRUD)
// PUT completely replaces an article and only the provided values are updated while the other values are set to null.


.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content})
    .then(()=> {
        res.send("Successfully updated the selected article.");
    })
    .catch(err => {
        res.send(err);
    })
})



// 3) PATCH - Updates a specific Article. (Update->CRUD)
// PATCH updates only a specific part of the article whose values is provided by the user.


.patch(async (req, res) => {
    try {
        await Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body });
        res.send("Successfully updated!");
    } catch (err) {
        res.send(err);
    }
})



// 4) DELETE - Deletes only the specified Article. (Delete->CRUD)


.delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }).then(() => {
        res.send('Post deleted from DB.');
    })
        .catch(err => {
            // res.status(400).send("Unable to save post to database.");
            res.send(err + "Unable delete from database.");
        });
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});