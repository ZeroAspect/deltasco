async function GetIP(){
  try {
    const response = await fetch('https://api.ipgeolocation.io/getip');
    const ip = await response.json();
    return ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
}

module.exports = GetIP