import mongoose, {Schema} from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"  // This package allows us to write the aggregation queries.

const videoSchema = new Schema({
    
       videofile: {
        type: String,   // From cloudinary
        required: true
       },
       thumbnail: {
        type: String,  // From cloudinary
        required: true
       },
       title: {
        type: String, 
        required: true
       },
       description: {
        type: String, 
        required: true
       },
       duration: {
        type: String, // From cloudinary, in cloudinary we will upload video and it will give us the duration.
        required: true
       },
       views: {
        type: Boolean, 
        default: true
       },
       owner: {
        type: Schema.Types.ObjectId, 
        ref: "User",
       } 
       
}, {timestamps: true});

//videoSchema.plugin(mongooseAggregatePaginate)  // iske baad hum aggregation queries likh paayenge.

export const Video  = mongoose.model("Video", videoSchema);