import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();

    try {
        const {username,code} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername});

        if(!user){
            return Response.json(
                {
                  success: "false",
                  message: "User doesn't exist!!",
                },
                {
                  status: 500,
                }
              );
        }
        const codeVerified = user.verifyCode === code;
        const codeNotExpired = new Date(user.verifyCodeExpiry)>new Date();

        if(codeVerified && codeNotExpired){
            user.isVerified = true;
            user.save();
            
            return Response.json(
                {
                  success: "true",
                  message: "User verified successfully!!",
                },
                {
                  status: 200,
                }
              );
        }
        else if(!codeNotExpired){
            return Response.json(
                {
                  success: "false",
                  message: "Verification Code expired!!,Please signup again to get a new code",
                },
                {
                  status: 400,
                }
              );
        }
        else{
            return Response.json(
                {
                  success: "false",
                  message: "Verification code is wrong!!",
                },
                {
                  status: 500,
                }
              );
        }
    } catch (error) {
        console.log("Error is ",error);
        return Response.json(
            {
              success: "false",
              message: "Error verifying verifycode",
            },
            {
              status: 500,
            }
          );
        
    }
}