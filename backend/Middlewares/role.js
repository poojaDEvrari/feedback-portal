const authrole=(...allowedRoles)=>{
    return(req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({Message:"access denied"});
        };
    
    next();
}
};
module.exports=authrole;