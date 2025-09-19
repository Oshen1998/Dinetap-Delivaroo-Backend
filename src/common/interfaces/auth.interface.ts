import { User } from "../../models/user";

export interface IRefreshTokenResult {
  error: string;
  accessToken?: undefined;
  refreshToken?: undefined;
  user?: User;
}
