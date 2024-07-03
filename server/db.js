import mongoose from "mongoose";

export const connectDB = () => {
mongoose
  .connect(process.env.DB_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then((data) => console.log("AuralLink Database Connected Successfully"))
  .catch((err) => console.log(err));

}