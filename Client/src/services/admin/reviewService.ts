import axios from "axios";
import type { ReviewRespone } from "../../types/IReview";

export interface TypeParams {
  page?: number;
  limit?: number;
  is_approved?: boolean;
  rating?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  hasReply?: boolean;
}

export const fetchGetReviewAdmin = async (
  dataParams: TypeParams
): Promise<ReviewRespone> => {
  const res = await axios.get("/api/review", {
    params: dataParams,
  });
  return res.data;
};

export const fetchReplyComment = async (
  reviewId: string | undefined,
  comment: string
) => {
  const res = await axios.post(`/api/review/${reviewId}/reply`, { comment });
  return res.data;
};

export const fetchApproved = async (
  reviewId: string | undefined,
  isApproved: boolean
) => {
  const res = await axios.put(`/api/review/approved/${reviewId}`, {
    isApproved,
  });
  return res.data;
};
