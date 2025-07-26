const axios = require("axios");
exports.getProvinces = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GHN_API}/master-data/province`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: process.env.GHN_TOKEN,
        },
      }
    );

    res.json({ provinces: response.data.data });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getDistrictsByProvince = async (req, res) => {
  const { provinceId } = req.params;
  try {
    const response = await axios.get(
      `${process.env.GHN_API}/master-data/district?province_id=${provinceId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: process.env.GHN_TOKEN,
        },
      }
    );

    res.json({ districts: response.data.data });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.getWardsByDistrict = async (req, res) => {
  const { districtId } = req.params;
  try {
    const response = await axios.get(
      `${process.env.GHN_API}/master-data/ward?district_id=${districtId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: process.env.GHN_TOKEN,
        },
      }
    );

    res.json({ wards: response.data.data });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.calculateFee = async (req, res) => {
  try {
    const { to_district_id, to_ward_code } = req.body;

    const response = await axios.post(
      `${process.env.GHN_API}/v2/shipping-order/fee`,
      {
        from_district_id: Number(process.env.GHN_SHOP_DISTRICT),
        from_ward_code: process.env.GHN_SHOP_WARD,
        service_type_id: 2,
        to_district_id: Number(to_district_id),
        to_ward_code: to_ward_code,
        weight: 1000,
        length: 20, // cm
        width: 15,
        height: 10,
        insurance_value: 0,
      },
      
      {
        headers: {
          "Content-Type": "application/json",
          Token: process.env.GHN_TOKEN,
          ShopId: parseInt(process.env.GHN_SHOP_ID),
        },
      }
    );
    res.json({ fee: response.data.data });
  } catch (error) {
    console.error("Lỗi tính phí:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Lỗi tính phí",
      error: error?.response?.data || error.message,
    });
  }
};
