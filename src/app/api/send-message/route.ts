import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
// import { authOptions } from "../sign-up/auth/[...nextauth]/options";
// import { getServerSession } from "next-auth";
// no need of these two things, as anyone can send messages
import {Message} from "../../../model/User";

export async function POST(request:Request){
    await dbConnect();

    try {
        const {username,content} = await request.json();

        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json(
                {
                  success: "False",
                  message: "User not exist!!",
                },
                { status: 500 }
              );
        }

        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: "False",
                  message: "User is not accepting messages!!",
                },
                { status: 403 }
              );
        }

        const newMessage = {content,createdAt:new Date()};
        user.message.push(newMessage as Message);
        //assertion humne jimma liya hai iska

        user.save();

        return Response.json(
            {
              success: "True",
              message: "Message has been sent successfully!!",
            },
            { status: 200 }
          );



        
    } catch (error) {
        console.log("Error in sending message!!", error);

    return Response.json(
      {
        success: "False",
        message: "Error in sending message!!",
      },
      { status: 500 }
    );
    }
}