import mongoose ,{Schema} from "mongoose";


const videoSchema = new Schema({
  videoFile:{
    type:String,
    required:true,
  },
  thumbnail:{
    type:String,
    required:true,
  },
  title:{
    type:String,
    required:true,
    trim:true,
  },
  description:{
    type:String,
    required:true,
    trim:true,
  },
  duration:{
    type:Number,
    required:true,
  },
  views:{
    type:Number,
    default:0,
  },
  likes:{
    type:Number,
    default:0,
  },
  isPublished:{
    type:Boolean,
    default:true,
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true,
  }
}, {
  timestamps: true
});




const Video = mongoose.model("video", videoSchema);
export default Video;