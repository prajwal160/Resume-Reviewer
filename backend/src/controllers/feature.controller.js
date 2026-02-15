const { getFeatureFlags } = require("../services/featureFlags");
const { addClient, removeClient } = require("../services/featureFlagEvents");

exports.listFeatureFlags = async (req, res) => {
  const { map } = await getFeatureFlags();
  res.json({ flags: map });
};

exports.streamFeatureFlags = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  res.write("retry: 10000\n\n");

  addClient(res);
  req.on("close", () => {
    removeClient(res);
  });
};
