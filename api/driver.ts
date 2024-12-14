import axiosInstance from "./main";

interface ISignIn {
  email: string;
  password: string;
}

export function driverSignIn(driver: ISignIn) {
  return axiosInstance
    .post("/drivers/signin", driver)
    .then((res: any) => res.data)
    .catch((error: any) => {
      throw error.response.data;
    });
}

interface IDriverChangePassword {
  id: string;
  token: string;
  value1: string;
  value2: string;
}

export function driverChangePassword({
  id,
  token,
  value1,
  value2,
}: IDriverChangePassword) {
  return axiosInstance
    .patch(
      `/drivers/${id}/changePassword`,
      { password: value1, confirmPassword: value2 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res: any) => res.data)
    .catch((error: any) => {
      throw error.response.data;
    });
}

interface IUpdate {
  id: string;
  token: string;
  value1: string;
  value2: string;
}

export function updateDriver({ id, token, value1, value2 }: IUpdate) {
  return axiosInstance
    .patch(
      `/drivers/${id}/update`,
      { firstName: value1, lastName: value2 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res: any) => res.data)
    .catch((error: any) => {
      throw error.response.data;
    });
}

export function deleteDriver({ id, token }: { id: string; token: string }) {
  return axiosInstance
    .delete(`/drivers/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
}

export function forgotPasswordDriver(email: string) {
  return axiosInstance
    .patch(`/drivers/forgotPassword`, { email })
    .then((res: any) => res.data)
    .catch((error: any) => {
      throw error.response.data;
    });
}