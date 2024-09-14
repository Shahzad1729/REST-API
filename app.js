const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

// connection
mongoose.connect("mongodb://localhost:27017/wikiDB");

// database schema
const articleSchema=new mongoose.Schema({
    title:String,
    content:String
});

// collection
const Article=mongoose.model("Article",articleSchema);



/************************Requests Targeting All Articles**************************************/
// GET, POST, DELETE

app.route("/articles").
get((req,res)=>{
    Article.find({}).then((foundArticles)=>{
        res.send(foundArticles);
    });
    
})
.post((req,res)=>{
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });

    newArticle.save().then(()=>
   {
    res.send("New article added successfully.");
})
})
.delete((req,res)=>{
    Article.deleteMany().then(()=>
    {
        res.send("All articles deleted successfully.")
    });
});


/************************Requests Targeting Single Article**************************************/

app.route("/articles/:articleTitle").get((req,res)=>{

    Article.findOne({title:req.params.articleTitle}).then((foundArticle)=>{
        if(foundArticle!=null)
        {
            res.send(foundArticle);
        }  
        else{
            res.send("No article found!");
        }
    }
)
}).put((req,res)=>{

    Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true}).then(()=>
    {
       res.send("Article updated successfully.")
    }).catch((err)=>{
    if(err){
        console.log(Error,err);
    }
});
}).patch((req,res)=>{
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body}
    ).then(()=>{
        res.send("Successfully patched the selected article.");
    }).catch((err)=>{
        if(err)
        {
            console.log(Error,err);
        }
    })
});



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});