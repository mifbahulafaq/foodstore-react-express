const Category = require("./model");
const {policyFor} = require('../policy');

async function store(req,res,next){

    let policy = policyFor(req.user);

    if(!policy.can('create','Category')){
        return res.json({
            error : 1,
            message : 'Anda tidak memilika akses untuk membuat category'
        })
    }

    try{
        let payload = req.body;

        let category = new Category(payload);
        await category.save();
        return res.json(category);

    }catch(err){
        if(err && err.name == "validationError"){
            return res.json({
                err : 1,
                message : err.message,
                fields : err.errors
            })
        }
        next(err)
    }
}

async function update(req,res,next){

    try{
        
        let policy = policyFor(req.user);
        
        if(!policy.can('update','Category')){
            return res.json({
                error : 1,
                message : 'Anda tidak memilika akses untuk mengupdate category'
            })
        }

        let payload = req.body;
        let category = await Category.findOneAndUpdate({_id : req.params.id},payload,{new:true,runValidators:true});
        return res.json(category);

    }catch(err){
        if(err && err.name == "validationError"){
            return res.json({
                err : 1,
                message : err.message,
                fields : err.errors
            })
        }
        next(err)
    }
}

async function destroy(req,res,next){
    try{
        
        let policy = policyFor(req.user);

        if(!policy.can('delete','Category')){
            return res.json({
                error : 1,
                message : 'Anda tidak memiliki akses untuk menghapus category'
            })
        }

        let category = await Category.findOneAndDelete({_id: req.params.id});
        return res.json(category);

    }catch(err){
        next(err)
    }
}

module.exports = {
    update,
    store,
    destroy
}