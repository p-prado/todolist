const express = require("express");
const date = require(`${__dirname}/date.js`)
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const _ = require("lodash");


// Connect to MongoDB database: todolistDB
mongoose.connect('mongodb+srv://admin-pablo:Test-123@cluster0.90erzc5.mongodb.net/todolistDB?retryWrites=true&w=majority');
// Use express functionality to parse urlencoded responses 
app.use(express.urlencoded({ extended: true }));
// Serve files in the "public" folder as static (Specify the location of the static files: in the public folder)
app.use(express.static("public"));
// Set view engine to ejs
app.set('view engine', 'ejs');


const defaultItems = [{name:"Welcome to your todo list!"}, {name: "Hit the + button to add new items."}, {name: "<-- Hit this to delete an item."}];

const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemsSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);



app.listen(port, function () {
    console.log(`Server started on port ${port}.`);
});

app.get("/", async function (req, res) {
    const day = date.getDate();
    Item.find({}, function (e, dbItems) {
        if (e) {
            console.log(e);
        } else {
            if (dbItems.length === 0) {
                Item.insertMany(defaultItems, function (e) {
                    if (e) {
                        console.log(e);
                    } else {
                        console.log("Items inserted successfully.")
                    }
                });
                res.redirect("/");
            } else {

                //
                List.find(function(e, foundLists){
                    console.log(foundLists)
                    if (e) {
                        console.log(e)
                    }else {
                        res.render("list", {
                            listTitle: "Today",
                            items: dbItems,
                            menuItems: foundLists
                        });
                    }});
            }
        }
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const newItem = new Item({name:itemName});

    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (e, foundList)=>{
            if (e) {
                console.log(e);
            } else {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect(`/${listName}`);
            }
        })
    }
});

app.post("/delete", function(req, res){
    const listName = req.body.listName;
    const checkboxID = req.body.checkbox_id;
    if(listName === "Today"){
        Item.deleteOne({_id: checkboxID}, function(e){
            if (e) {
                console.log(e);
            } else {
                console.log(`Deleted Item with _id = ${req.body.checkbox_id}`);
                res.redirect("/");
            }
        });
    } else{
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: checkboxID}}},
            function(e, results){
                res.redirect(`/${listName}`);
        });
    }
})

app.get("/:listName", (req, res) => {
    const listName = _.lowerCase(req.params.listName);    
    List.findOne({name: listName}, (e, foundList) => {
        if (!e) {
            if(!foundList){
                const list = new List({
                    name: listName,
                    items: defaultItems
                });
                list.save();
                res.redirect(`/${listName}`);
                console.log(`Created list: ${list}`);
            } else {
                List.find(function(e, foundLists){
                    console.log(foundLists)
                    if (e) {
                        console.log(e)
                    }else {
                        res.render("list", {
                            listTitle: _.startCase(foundList.name),
                            items: foundList.items,
                            menuItems: foundLists
                        });
                    }
                });
            }
        } else {
            console.log(e);
        }
    });
});

app.post("/work", function (req, res) {
    workItems.push(req.body.newItem);
    res.redirect("/work");
});

app.get("/about", function (req, res) {
    res.render("about");
})