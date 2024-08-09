import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { authOptions } from "../sign-up/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User is not Authenticated",
      },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match the user by userId
      { $unwind: "$messages" }, // Unwind the messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt in descending order
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Group by user _id and push sorted messages back into an array
    ]);


    if (!user || user.length === 0) {
      return Response.json(
        {
          success: true,
          message: "No message found!!",
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error has occured while getting messages!! ", error);

    return Response.json(
      {
        success: false,
        message: "Error has occured while getting messages!!",
      },
      { status: 500 }
    );
  }
}
