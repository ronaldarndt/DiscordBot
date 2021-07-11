import Servers, { Server } from '../services/servers';
const serversService = new Servers();

let t = new Date().getTime();
let servers: Array<Server>;

export const getServersAsync = async () => {
  const now = new Date().getTime();

  if (!servers || now - t > 1000 * 60 * 5) {
    servers = await serversService.getServersAsync();
    t = now;
  }

  return servers;
};

export const invalidateCache = () => {
  servers = undefined;
};
