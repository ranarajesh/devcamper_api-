const NodeGeoCoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  //fetch: customFetchImplementation,
  apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};
const geoCoder = NodeGeoCoder(options);

module.exports = geoCoder;
