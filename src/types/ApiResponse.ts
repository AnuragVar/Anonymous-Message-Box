import { Message } from "@/model/User";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  //optional, might not be in every ApiResponse
  //this is helpful in having typescript as well as the suggestions
  
}
