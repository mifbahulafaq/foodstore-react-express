const {policyFor} = require('../policy');
const Product = require('../product/model');
const CartItem = require('../cart-item/model');

async function update(req,res,next){
    const policy = policyFor(req.user);

    if(!policy.can('update','Cart')){
        return res.json({
            error : 1,
            message : `you're not allowd to perfomr this actions`
        })
    }
	//console.log(req.body)
    try{
        const {items} = req.body;
        const productIds = items.map(itm=>itm.product._id);

        const products = await Product.find({_id:{$in:productIds}});

        let carItems = items.map(item=>{
            let relatedProduct = products.find(product=>product._id.toString() === item.product._id);

            return {
                product : relatedProduct._id,
                price : relatedProduct.price,
                image_url : relatedProduct.image_url,
                name : relatedProduct.name,
                user : req.user._id,
                qty : item.qty
            }
        })
		console.log(carItems)
        await CartItem.deleteMany({user : req.user._id});
        await CartItem.bulkWrite(carItems.map(item=>{
            return {
                updateOne : {
                    filter : {user : req.user._id, product: item.product},
                    update : item,
                    upsert : true
                }
            }
        }))
        return res.json(carItems);
    }catch(err){
        if(err && err.name === 'ValidationError'){
            return res.json({
                error : 1,
                message : err.message,
                fields : err.errors
            })
        }
		console.log(err)
        next(err)

    }
}

async function index(req,res,next){
    let policy = policyFor(req.user);

    if(!policy.can('read','Cart')){
        return res.json({
            error:1,
            message:"you are not allowd to perform this action"
        })
    }
	console.log(req.user._id)
    try{

        let items = await CartItem.find({user:req.user._id}).populate('product')
        return res.json(items)

    }catch(err){

        if(err && err.name === 'ValidationError'){
            res.json({
                error : 1,
                message : err.message,
                fields : err.errors
            })
        }

        next(err)

    }
}

module.exports = {
    update,
    index
}