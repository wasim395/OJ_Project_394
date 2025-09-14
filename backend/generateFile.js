
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const dirCodes = path.join(__dirname, 'codes'); // this is like directry of backend + codes file path 
                                                // Doubment/.../backend/code

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async ( language , code ) => {

    const jobId = uuidv4() ;
    const fileName = `${jobId}.${language}` ;
    const filePath = path.join( dirCodes , fileName ) ;
    fs.writeFileSync( filePath , code ) ;
    return filePath ;

}; 

module.exports = {
    generateFile,
};