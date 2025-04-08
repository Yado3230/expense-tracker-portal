import { api } from "./api";
import { User } from "./auth";

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  currency?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => "/api/users/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (userData) => ({
        url: "/api/users/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
