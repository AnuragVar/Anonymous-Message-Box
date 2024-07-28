import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import { resend } from "@/lib/resend";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    console.log("hi1");

    const { username, email, password } = await request.json();

    const UserExistByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (UserExistByUsername) {
      return Response.json(
        { success: "false", message: "User already exists" },
        { status: 400 }
      );
    }

    const UserExistByEmail = await UserModel.findOne({ email });
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("hi");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hi");
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (UserExistByEmail) {
      if (UserExistByEmail.isVerified) {
        return Response.json(
          { success: "false", message: "User already exists!!" },
          { status: 500 }
        );
      }
      UserExistByEmail.verifyCode = verificationCode;
      UserExistByEmail.password = hashedPassword;
      UserExistByEmail.verifyCodeExpiry = expiryDate;
      UserExistByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

      UserExistByEmail.save();
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verificationCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      newUser.save();
    }

    const EmailResponse = await sendVerificationEmail(
      username,
      email,
      verificationCode
    );
    

    if (!EmailResponse.success)
      return Response.json(
        { success: "false", message: EmailResponse.message },
        { status: 500 }
      );
    else{
      console.log(EmailResponse);
      
    }

    return Response.json(
      { success: "true", message: "User registered successfully!!" },
      { status: 200 }
    );

    //1. checking if user already exists using username
    //2. checking if using email
    //3. if not,hashed the password
    //4. create otp
    //5. verifycode expiry dat
    //6. save the user
    //7. mail him the verification code

    //1.2 if exists return
    //2.2 if isverified return
    // 2.2.1 else generate new verification code and expiry and update password
    //2.2.2 save the user and mail him
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: "false", message: "Error Registering User" },
      { status: 404 }
    );
  }
}
