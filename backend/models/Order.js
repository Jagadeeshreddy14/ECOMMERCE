const mongoose=require("mongoose")
const {Schema}=mongoose

const orderSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    item:{
        type:[Schema.Types.Mixed],
        required:true
    },
    address:{
        type:Schema.Types.Mixed,
        required:true
    },
    status:{
        type:String,
        enum:['Pending','Dispatched','Out for delivery','Delivered','Cancelled'],
        default:'Pending'
    },
    paymentMode:{
        type:String,
        enum:['COD','UPI','CARD'],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['Pending','Processing','Completed','Failed'],
        default:'Pending'
    },
    paymentId: String,
    discount: Number,
    total:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    returnRequest:{
        isRequested: { type: Boolean, default: false },
        requestDate: Date,
        reason: String,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed'],
            default: 'pending'
        },
        images: [String],
        responseDate: Date,
        responseMessage: String
    },
    cancellation: {
        reason: { type: String, default: null },
        cancelledAt: { type: Date, default: null }
    }
},{versionKey:false})

module.exports=mongoose.model("Order",orderSchema)