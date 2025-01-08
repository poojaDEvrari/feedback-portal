const express = require("express");
const router = express.Router();
const authenticateToken =require("../Middlewares/Auth");
const authrole =require("../Middlewares/role");
router.get("/admin",authenticateToken,authrole("admin"),(req,res)=>
{
    res.json({Message:"welcome admin"});
});
router.get("/client",authrole("admin","client"),(req,res)=>{
        res.json({Message:"welcome client"});
    });
    module.exports=router;