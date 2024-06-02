
const fs = require('fs');
const { exec } = require("child_process");
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const outputPath = path.join(__dirname, 'outputsOfCode'); // this is like directry of backend + codes file path 
                                                // Doubment/.../backend/code

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async ( filePath , fileInputPath ) => {

    const jobId = path.basename(filePath).split(".")[0] ;// basename take only last abc/xyx/last 
    const outputFileName = `${jobId}.exe` ;
    const outputFileNamePath = path.join(outputPath , outputFileName ) ;

    return new Promise( (resolve ,reject ) => {

        exec( `g++ ${filePath} -o ${outputFileNamePath} && cd ${outputPath} && timeout 4s  ./${outputFileName} < ${fileInputPath}` , ( error , stdout , stderr ) => {

            if( error ){
                reject(error) ;
            }
            if( stderr ){
                reject(stderr) ;
            }
            resolve(stdout) ;

        });

    });


}; 

module.exports = {
    executeCpp,
};