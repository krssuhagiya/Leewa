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
app.get("/bride",(req,res)=>{
    res.render("bride");
});
app.get("/groom",(req,res)=>{
    res.render("groom");
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
app.get("/aboutus",(req,res)=>{
    res.render("aboutus");
});

app.get("/corporateinfo",(req,res)=>{
    res.render("corporateinfo");
});
app.get("/termandcondition",(req,res)=>{
    res.render("termandcondition");
});
app.get("/privacypolicy",(req,res)=>{
    res.render("privacypolicy");
});
app.get("/cookiepolicy",(req,res)=>{
    res.render("cookiepolicy");
});
app.get("/shippingpolicy",(req,res)=>{
    res.render("shippingpolicy");
});
app.get("/orderandshipment",(req,res)=>{
    res.render("orderandshipment");
});
app.get("/returnandexchange",(req,res)=>{
    res.render("returnandexchange");
});
app.get("/contact",(req,res)=>{
    res.render("contact");
});
app.get("/FAQs",(req,res)=>{
    res.render("FAQs");
});
app.get("/gifts",(req,res)=>{
    res.render("gifts");
});
app.get("/store-locator",(req,res)=>{
    res.render("storelocator");
});
app.get("/sitemap",(req,res)=>{
    res.render("sitemap");
});


app.listen(8080);