const jwt = require("jsonwebtoken")

//yesma token cha ki nae yedi token cha vaney tyo right token hoki haina 

 function verifyToken(req,res,next){

    //yesma token chae ki nae hereko 1st step ma 
    const token = req?.cookies?.access_token
    console.log(token);
    if(!token) return res.status(401).send("Youre not user and dont have account")


// yesma chae if token cha vaney tyo token right hoki haina 
    jwt.verify(token, process.env.SECRET,(err, userInfo)=>{
        if(err) return res.status(403).send("Your token isnt valid ")
        req.yesmaChaejnilekhnamilcha = userInfo
        next()
        
    })
}

function verifyUser(req,res,next){

    //paila token valid cha ki nae hereko ani further process gareko 
    verifyToken(req,res, ()=>{
        if(req.yesmaChaejnilekhnamilcha.id === req.params.id || req.yesmaChaejnilekhnamilcha.isAdmin){
            next()
        }
        else{
            return res.status(403).send("Your token isnt valid ")
        }
    })
}

function verifyAdmin(req,res,next){
    verifyToken(req,res, ()=>{
        if(req.yesmaChaejnilekhnamilcha.isAdmin){
            next()
        }
        else{
            return res.status(403).send("You are not admin")
        }
    })
}

module.exports = {verifyToken, verifyUser, verifyAdmin}