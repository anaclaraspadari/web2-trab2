const usersDAO=require("../models/users-dao")

const usersController={
    getAll: (req,res) => {
        console.log("Iniciando consulta");
        const users=usersDAO.getAll();
        console.log(users);
        res.render('usersList',{users});
    },
    getById: (req,res)=>{
        const id=req.params.id;
        const user=usersDAO.getById(id);
        res.json(user)
    }
}

module.exports=usersController