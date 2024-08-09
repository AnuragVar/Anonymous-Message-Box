import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject ={};

export async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database!!");
        return;
    }
    //check if the connection is already there

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{});
        //{} to pass options into it

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected successfully!!",db);
        
    } catch (error) {
        console.log("DataBase Connection failed!!",error);
        process.exit(1);
    }
}
//filename can be anything
//void in c++ is diff. from here
//void means we are not worried with the type
