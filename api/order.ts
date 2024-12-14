import axiosInstance from "./main";

interface IOrderFilter {
  page: number;
  token: string;
}

export function getDeliveries({ page, token }: IOrderFilter) {
  return axiosInstance
    .get("/orders/deliveries", {
      params: { page },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res: any) => {
      return res.data.data.orders;
    })
    .catch((error: any) => {
      throw error.response.data;
    });
}

interface IOrderDeliver {
  id: string;
  key: string;
  token: string;
}

export function deliverOrder({ id, token, key }: IOrderDeliver) {
  return axiosInstance
    .patch(
      `/orders/${id}/deliver`,
      { key },
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
