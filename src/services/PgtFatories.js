import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const PgtFactories = {
  getListPGT: async ( Type = 10  , KeyWord, Category) => {
    let params = {} ; 
    if (KeyWord){
      params.KeyWord = KeyWord;
    }
    if (Category){
      params.Category = Category;
    }
    if (Type){
      params.Type = Type;
    }
    return ApiOperation.request({
      url: ApiConstants.PGT,
      method: "GET",
      params: params, 
    });
  },
  getPGTDetail: async data => {
    return ApiOperation.request({
      url: `${ApiConstants.PGT}/${data}`,
      method: "GET",
    });
  },
  getPGTFeedbackList: async data => {
    return ApiOperation.request({
      url: `${ApiConstants.PGT_FEEDBACK}/${data}`,
      method: "GET",
    });
  },
  requestBooking: async data => {
    return ApiOperation.request({
      url: ApiConstants.BOOKING_PGT,
      method: "POST",
      data: data,
    });
  },
};

export default PgtFactories;
