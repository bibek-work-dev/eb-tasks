export type CreateUserInput = Omit<TypeUser, "id">;
export type UpdateUserInput = TypeUser;
export type DeleteUserInput = Pick<TypeUser, "id">;

export type TypeUser = {
  id: number;
  name: string;
  email: string;
};
