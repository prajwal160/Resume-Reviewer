const clients = new Set();

const addClient = (res) => {
  clients.add(res);
};

const removeClient = (res) => {
  clients.delete(res);
};

const broadcastFeatureFlagUpdate = (payload = {}) => {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of clients) {
    try {
      client.write(data);
    } catch {
      clients.delete(client);
    }
  }
};

module.exports = {
  addClient,
  removeClient,
  broadcastFeatureFlagUpdate,
};
