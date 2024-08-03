import { User, getServerSession } from "next-auth";
import { authOptions } from "../../sign-up/auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User authentication failed",
      },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: { messages: { _id: messageId } },
      }
    );
    if(updatedResult.modifiedCount==0){
        return Response.json({
            success: false,
            message: 'Message does not exist or already deleted!!'
        },{
            status:404
        })
    }
    return Response.json({
        success: true,
        message: "Message Deleted Successfully!!"
    },{status:200})
  } catch (error) {
    console.log("Error while deleting the message ", error);
    Response.json(
      {
        success: "false",
        message: "Error while deleting the message",
      },
      { status: 500 }
    );
  }
}
