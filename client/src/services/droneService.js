export const getAllLogs = async (droneId, signal) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/logs/${droneId}`, {
    signal
  })
  return await response.json()
};

export const getDroneById = async (droneId, signal) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/configs/${droneId}`, {
    signal,
  })
  return await response.json()
};

export const createDroneLog = async (logData) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
  })
  if(!response.ok) throw new Error("Failed to create log, please try again")
  return await response.json()
}