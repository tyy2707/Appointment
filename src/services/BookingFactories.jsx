import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const BookingFactories = {
  
  getListBookingForUser: async id => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_USER}/${id}`,
      method: "GET",
    });
  },
  getListRequestBookingForPGT: async id => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_PGT}/${id}`,
      method: "GET",
    });
  },
  requestBooking: async data => {
    return ApiOperation.request({
      url: ApiConstants.BOOKING,
      method: "POST",
      data: data,
    });
  },
  checkrequestTimeBooking: async data => {
    return ApiOperation.request({
      url: ApiConstants.BOOKING_TIME,
      method: "POST",
      data: data,
    });
  },
  updateBooking: async (id, type, rate, comment, pgt_id, amount, userName) => {
    const data = {
      rate: rate,
      comment: comment,
      pgt_id: pgt_id,
      amount: amount,
      user_name: userName,
    }
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING}/${id}`,
      method: "PUT",
      data: data,
      params: {
        type: type
      }
    });
  },

  deleteBookingId: async (id) => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING}/${id}`,
      method: "DELETE",
    });
  },
  getBookingDetail: async data => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING}/${data}`,
      method: "GET",
    });
  },
  getBookingChart: async (year, month, date) => {
    let params = {
    };
    if (year) {
      params.Year = year;
    }
    if (month) {
      params.Month = month;
    }
    if (date) {
      params.Date = date;
    }
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_CHART}`,
      method: "GET",
      params: params,
    });
  },
  getBookingTopPgt: async (year, month, date) => {
    let params = {
    };
    if (year) {
      params.Year = year;
    }
    if (month) {
      params.Month = month;
    }
    if (date) {
      params.Date = date;
    }
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_TOP}`,
      method: "GET",
      params: params,
    });
  },
};

export default BookingFactories;
