import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { usernameValidation } from "@/schema/signUpSchema";
import { z } from "zod";

const UsernamequerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // if (request.method != "GET") {
  //   return Response.json(
  //     {
  //       success: "false",
  //       message: "Only GET Request is allowed!!",
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    // console.log(searchParams);
    // console.log('hi');
    

    const queryParams = {
      username: searchParams.get("username"),
    };
    // console.log(queryParams.username);

    const result = UsernamequerySchema.safeParse(queryParams);

    // console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      console.log(usernameErrors);

      return Response.json(
        {
          success: "false",
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }
    console.log(result);
    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: "true",
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: "false",
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: "true",
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while checking uniqueness of username ", error);
    return Response.json(
      {
        success: "false",
        message: "Error while checking uniqueness of username",
      },
      {
        status: 500,
      }
    );
  }
}
