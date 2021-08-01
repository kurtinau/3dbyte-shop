import Adapters, { TypeORMUserModel } from "next-auth/adapters"
import { EntitySchemaColumnOptions } from 'typeorm'

// Extend the built-in models using class inheritance
export default class User extends (<any>Adapters.TypeORM.Models.User.model){
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(name, email, image, emailVerified) {
    super(name, email, image, emailVerified)
  }
}

type UserSchemaType = {
    name: string;
    target: typeof TypeORMUserModel;
    columns: {
        firstName?: {
            type: "varchar",
            nullable: boolean,
          };
          lastName?:{
              type: "varchar",
              nullable: boolean,
          };
      name?: EntitySchemaColumnOptions;
      email?: EntitySchemaColumnOptions;
      image?: EntitySchemaColumnOptions;
      emailVerified?: EntitySchemaColumnOptions;
    };
  };

export const UserSchema : UserSchemaType = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    // Adds a phoneNumber to the User schema
    firstName: {
      type: "varchar",
      nullable: true,
    },
    lastName:{
        type: "varchar",
        nullable: true,
    }
  },
}