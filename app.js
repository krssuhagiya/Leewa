const express = require('express');
const path = require("path");
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.redirect("/home");
});

app.get("/home",(req,res)=>{
    res.render("home");
});

app.get("/men",(req,res)=>{
    res.render("men");
});

app.get("/women",(req,res)=>{
    res.render("women");
});

app.get("/wedding",(req,res)=>{
    res.render("wedding");
});

app.get("/sale",(req,res)=>{
    res.render("sale");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/admin",(req,res)=>{
    res.render("admin");
});


app.listen(8080);