import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../sign-up/auth/[...nextauth]/options";
import { User } from "next-auth";

//to update user status in accepting messages
export async function POST(request: Request) {
  await dbConnect();
    
  try {
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

    const userId = user._id;
    const acceptMessages = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(userId,{
        isAcceptingMessage:acceptMessages
    },{new: true})

    if(!updatedUser){
        return Response.json(
            {
              success: "False",
              message: "User status to accept messages is not yet updated!!",
            },
            { status: 401 }
          );
    }

    return Response.json(
        {
          success: "True",
          message: "User status to accept messages is successfully updated!!",
        },
        { status: 200 }
      );

  } catch (error) {
    console.log("Failed to update user status to accept messages!! ", error);

    return Response.json(
      {
        success: "False",
        message: "Failed to update user status to accept messages!! ",
      },
      { status: 500 }
    );
  }
}

//to get the user status for accepting messages
export async function GET(request:Request){
    await dbConnect();
    
  try {
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

    const userId = user._id;

    const foundUser = await UserModel.findOne({
        _id:userId
    });

    if(!foundUser){
        return Response.json(
            {
              success: "False",
              message: "User not found!!",
            },
            { status: 404 }
          );
    }

    return Response.json(
        {
          success: "True",
          message: "User found successfully!!",
          isAcceptingMessages:foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );

  } catch (error) {
    console.log("Error in getting accepting Message status", error);

    return Response.json(
      {
        success: "False",
        message: "Error in getting accepting Message status",
      },
      { status: 500 }
    );
  }
}
