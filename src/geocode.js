export async function getCoordinates(place){

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

  const res = await fetch(url);

  const data = await res.json();

  if(!data || data.length === 0){
    throw new Error("Location not found");
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };

}