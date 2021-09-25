import fetch, { RequestInit } from 'node-fetch';

async function fetchJsonAsync<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, options).then(x => x.json());

  return response as T;
}

export { fetchJsonAsync };
