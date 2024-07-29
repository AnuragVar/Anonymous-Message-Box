import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { authOptions } from "../sign-up/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    
    if(!session || !user){
        return Response.json(
            {
                success: "False",
                message: "User is not Authenticated",
            },
            { status: 401 }
            );
        }
        
        const userId = new mongoose.Types.ObjectId(user._id);
        try {

        const user = await UserModel.aggregate([
            {$match:{id: userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        if(!user || user.length===0){
            return Response.json(
                {
                    success: "False",
                    message: "User not found!!",
                },
                { status: 404 }
                );
        }
        return Response.json({
            success:'True',
            messages:user[0].messages
        })
    } catch (error) {
        console.log("Error has occured while getting messages!! ",error);

        return Response.json(
            {
              success: "False",
              message: "Error has occured while getting messages!!",
            },
            { status: 500 }
          );
        
    }
}