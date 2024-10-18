import mongoose, { Schema } from "mongoose";
import User from "./user.model";

const subscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId, 
    ref: User,
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
}, {timestamps: true});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
 export default Subscription;