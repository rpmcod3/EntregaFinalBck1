import { Router } from "express";
import { UserModel } from "../models/users.model.js";




const route = Router()

route.get('/', async (req, res) => {
    const result = await UserModel.find({})

    res.json({ mensaje : 'Usuarios', result}) 

})


export default route


