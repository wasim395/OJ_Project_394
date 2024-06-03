
const Problems = require('../modols/Problems') ;
const User = require("../modols/User") ; 


const admin = async (req , res) => {
    try{
        const adminId = req.user._id ;
        const problemList = await Problems.find( {createdBy : adminId} ) ;
        res.status(200).json( problemList )
    }
    catch(error){
        res.status(500).send("catch /admin " , error ) ;
    }
};

const create = async (req , res) => {
    const creater = req.user._id ;
    // console.log("the creater id is : " , creater ) ;
    const {title , problemStatement , explainInput , explainOutput , testCases } = req.body ;
    const newProblem = await Problems.create({
        title : title ,
        problemStatement : problemStatement ,
        expectedInput : explainInput ,
        expectedOutput : explainOutput ,
        testCase : testCases,
        createdBy : creater ,
    });
    // console.log( newProblem ) ;
    res.send(200) ;
};

const edit = async (req , res) => {
    
    const { title, problemStatement, explainInput, explainOutput, testCases } = req.body;
  
    try {
      const problem = await Problems.findById(req.params.id);
      if (!problem) {
        return res.status(404).send({ error: 'Problem not found' });
      }
  
        problem.title = title;
        problem.problemStatement = problemStatement;
        problem.expectedInput = explainInput ;
        problem.expectedOutput = explainOutput ;
        problem.testCase = testCases ;
    
        await problem.save();
  
      res.status(200).send({ message: 'Document updated successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Error updating the problem' });
    }

};

const deleteProblem = async (req , res) => {

    try {
        const result = await Problems.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
          return res.status(404).send({ error: 'Problem not found' });
        }
        res.status(200).send({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).send({ error: 'Error deleting the problem' });
    }

};

module.exports = {
    admin ,
    create ,
    edit ,
    deleteProblem ,
}