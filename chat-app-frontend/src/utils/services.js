export const baseUrl = 'http://localhost:3000/api/v1';

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message = data?.message ? data.message : data;

    return { error: true, message };
  }

  return data;
}