const Tag = require("./model");

async function store(req,res,next){

    try{
        let policy = policyFor(req.user);
        
        if(!policy.can('create','Tag')){
            return res.json({
                error : 1,
                message : 'Anda tidak memilika akses untuk membuat tag'
            })
        }

        let payload = req.body;

        let tag = new Tag(payload);
        await tag.save();
        return res.json(tag);

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

        if(!policy.can('update','Tag')){
            return res.json({
                error : 1,
                message : 'Anda tidak memilika akses untuk mengupdate tag'
            })
        }

        let payload = req.body;
        let tag = await Tag.findOneAndUpdate({_id : req.params.id},payload,{new:true,runValidators:true});
        return res.json(tag);

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

        if(!policy.can('delete','Tag')){
            return res.json({
                error : 1,
                message : 'Anda tidak memilika akses untuk menghapus tag'
            })
        }

        let tag = await Tag.findOneAndDelete({_id: req.params.id});
        return res.json(tag);

    }catch(err){
        next(err)
    }
}

module.exports = {
    update,
    store,
    destroy
}