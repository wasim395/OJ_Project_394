
const Problems = require('../modols/Problems') ;

const home = async ( req , res ) => {
    const array = await Problems.find() ;
    res.json(array) ;
};

const problem = async ( req , res ) => {
    try{
        const problemId = req.params.id  ;
        const currProblem = await Problems.findOne( {_id : problemId } ) ;
        res.json(currProblem) ; 
    }
    catch(error){
        res.status(404).send(error) ;
    }
};

module.exports = {
    home ,
    problem,
}