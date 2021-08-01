import { TypeORMUserModel } from "next-auth/adapters";
import CustomUser, { UserSchema } from "./User"


// const exportModel : modelType = {
//     User: {
//       model: User as typeof TypeORMUserModel,
//       schema: UserSchema,
//     },
//   };

//   export default exportModel;


export default {
  User: {
    model: CustomUser,
    schema: UserSchema,
  },
}