

module.exports.home = (req,res) => {
    res.status(200).json({
        success:true,
        message:'This is homepage for product route'
    });
}