const {subject} = require('@casl/ability');
const Invoice = require('./model');
const {policyFor} = require('../policy');
const midtransClient = require('midtrans-client');
const config = require('../config')
console.log(config)
let snap = new midtransClient.Snap({
	isProduction: config.midtrans.isProduction,
	serverKey: config.midtrans.serverKey,
	clientKey: config.midtrans.clientKey
})

async function show(req,res,next){

    try{
        let {order_id} = req.params;
		console.log('dsdsdsds')

        let invoice = await Invoice.findOne({order : order_id}).populate('order').populate('user');
		console.log(invoice)
        let policy = policyFor(req.user)

        let subjectInvoice = subject('Invoice',{...invoice, user_id : invoice.user._id});

        if(!policy.can('read', subjectInvoice)){
            return res.json({
                error : 1,
                message : 'Anda tidak memiliki akses untuk melihat invoice ini'
            })
        }

        return res.json(invoice);
    }catch(err){
		console.log(err)
        if(err && err.name === 'ValidationError'){
            return res.json({
                err : 1,
                message : `Error when getting invoice`
            })
        }
		next(err)
    }
}

async function initiatePayment(req, res){
	
	try{
		
		let { order_id } = req.params;
		
		let invoice = await Invoice
			.findOne({order: order_id})
			.populate('order')
			.populate('user');
			
		if(!invoice){
			return res.json({
				error: 1,
				message: 'Invoice not found'
			})
		}
		
		let parameter = {
			transaction_details:{
				order_id: invoice.order._id,
				gross_amount: invoice.total
			},
			credit_card: {
				scure: true
			},
			
			customer_details: {
				first_name: invoice.user.full_name,
				email: invoice.user.email
			}
		}
		
		let response = await snap.createTransaction(parameter);
		console.log(response)
		
		return res.json(response)
		
	}catch(err){
		console.log(err)
		return res.json({
			error: 1,
			message: 'something went wrong'
		})
	}
}

async function handleMidtransNotification(req, res){
	try{
		
		let statusResponse = await snap.transaction.notification(req.body)
		
		let orderId = statusResponse.order_id;
		let transactionStatus = statusResponse.transaction_status;
		let fraudStatus = statusResponse.fraud_status;
		
		if(transactionStatus == 'capture'){
			
			if(fraudStatus == 'challenge'){
				
				await snap.transaction.approve(orderId);
				
				await Invoice.findOneAndUpdate({order:orderId}, {payment_status: 'paid'});
				
				await Order.findOneAndUpdate({_id: orderId},{status: 'processing'})
				
				return res.json('success');
				
			}else if(fraudStatus == 'accept'){
				
				await Invoice.findOneAndUpdate({order:orderId}, {payment_status: 'paid'});
				
				await Order.findOneAndUpdate({_id: orderId},{status: 'processing'})
				
				return res.json('success');
			}else{
				return res.json('ok')
			}
		}else if(transactionStatus == 'settlement'){
			
				
				await Invoice.findOneAndUpdate({order:orderId}, {payment_status: 'paid'});
				
				await Order.findOneAndUpdate({_id: orderId},{status: 'delivered	'})
				
				return res.json('success');
				
		}
		
	}catch(error){
		return res.status(500).json('Something went wrong')
	}
}

module.exports = {
    show,
	initiatePayment,
	handleMidtransNotification
}