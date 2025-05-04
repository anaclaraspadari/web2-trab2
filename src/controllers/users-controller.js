const usersDAO=require("../models/users-dao")

const usersController={
    getAll: (req,res) => {
        console.log("Iniciando consulta");
        const results=usersDAO.getAll();
        usersDAO.test();
        console.log(results);
        res.json(results);
    }
}

module.exports=usersController