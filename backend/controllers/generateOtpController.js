

const isGenerated = (req , res) => {
    res.status(200).send("OTP Generated Successfully") ;
}

module.exports = {isGenerated} ;