import { query, Router } from "express";
import { UserModel } from "../models/users.model.js";




const route = Router()

route.get('/', async (req, res) => {
    const query = req.query

//paginate



    const opcion = {
		limit: query.limit || 10,
		page: query.page || 1,
        
        sort: { }  
	}


    const result = await UserModel.paginate({}, opcion)
    console.log(result)

    const response = {
		count: result.totalDocs,
		result: result.docs,
		currentPage: result.page,
		hasPrev: result.hasPrevPage,
		hasNext: result.hasNextPage,
		prev: `?page=${result.prevPage}&limit=${query.limit}`,
		next: `?page=${result.nextPage}&limit=${query.limit}`
	}

    res.json(response) 


    /* res.json({ mensaje : 'Usuarios', result}) */ 

})
/* 
route.get('/', async (req, res) => {
    const result = await UserModel.find({})

    res.json({ mensaje : 'Usuarios', result}) 

}) */

export default route


