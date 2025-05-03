const {usersDAO}=require("../models/users.dao")

const usersController={
    getAll: async (req,res) => {
        try{
            const users=await usersDAO.getAll()
            res.render('usersList',{users})
        }catch(error){
            res.status(500).json({error:"erro ao obter usuarios"})
        }
    }
}

module.exports=usersController