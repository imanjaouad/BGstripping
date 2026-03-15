function checkRole(roleAttendu){
    return (req,res,next)=>{
        if(req.user.role !== roleAttendu){
            return res.status(404).json({message : "Accès reffusé !"})
        }
        next();

    }
}

module.exports = checkRole;