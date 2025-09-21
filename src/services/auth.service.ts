import { Op } from "sequelize";
import { models } from "../models";

export const findUserByEmail = async (email: string) => {
  return await models.User.findOne({ where: { email } });
};

export const createUser = async (
  email: string,
  password: string,
  name: string,
  phoneNumber?: string
) => {
  return await models.User.create({ email, password, name, phoneNumber });
};

export const updateUserDetails = async (
  id: string,
  email?: string,
  name?: string,
  phoneNumber?: string
) => {
  return await models.User.update(
    { email, name, phoneNumber },
    {
      where: { id },
    }
  );
};

export const userDeleted = async (userId: number) => {
  return await models.User.update(
    { status: "INACTIVE" },
    { where: { id: userId, status: { [Op.ne]: "INACTIVE" } } }
  );
};

export const getAllActiveMembers = async () => {
  return models.User.findAll({
    where: {
      status: "ACTIVE",
    },
  });
};
