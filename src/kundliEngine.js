import { AstroTime, GeoVector, Body, SiderealTime } from "astronomy-engine";

/* -----------------------------
   Zodiac Signs
----------------------------- */

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer",
  "Leo","Virgo","Libra","Scorpio",
  "Sagittarius","Capricorn","Aquarius","Pisces"
];

export function degreeToSign(deg) {
  return SIGNS[Math.floor(deg / 30)];
}

/* -----------------------------
   Nakshatras
----------------------------- */

const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira",
  "Ardra","Punarvasu","Pushya","Ashlesha","Magha",
  "Purva Phalguni","Uttara Phalguni","Hasta","Chitra",
  "Swati","Vishakha","Anuradha","Jyeshtha","Mula",
  "Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta",
  "Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
];

export function getNakshatra(deg) {

  const segment = 360 / 27;

  const index = Math.floor(deg / segment);

  return NAKSHATRAS[index];
}

/* -----------------------------
   Lahiri Ayanamsa
----------------------------- */

function applyAyanamsa(lon, date) {

  const year = date.getFullYear();

  const ayanamsa = 24 + (year - 2000) * 0.013;

  return ((lon - ayanamsa) % 360 + 360) % 360;

}

/* -----------------------------
   Planet Calculation
----------------------------- */

export function calculatePlanets(date) {

  const time = new AstroTime(date);

  const bodies = {
    Sun: Body.Sun,
    Moon: Body.Moon,
    Mercury: Body.Mercury,
    Venus: Body.Venus,
    Mars: Body.Mars,
    Jupiter: Body.Jupiter,
    Saturn: Body.Saturn
  };

  const planets = {};

  for (const [name, body] of Object.entries(bodies)) {

    const vec = GeoVector(body, time);

    let lon = ((vec.elon % 360) + 360) % 360;

    lon = applyAyanamsa(lon, date);

    planets[name] = lon;

  }

  /* Rahu & Ketu (Moon nodes) */

  const moonVec = GeoVector(Body.Moon, time);

  let rahu = ((moonVec.elon - 180) + 360) % 360;

  rahu = applyAyanamsa(rahu, date);

  planets["Rahu"] = rahu;

  planets["Ketu"] = (rahu + 180) % 360;

  return planets;
}

/* -----------------------------
   Ascendant (Lagna)
----------------------------- */

export function calculateAscendant(date, lat, lon) {

  const time = new AstroTime(date);

  const lst = SiderealTime(time) + lon / 15;

  const epsilon = 23.4367; // Earth axial tilt

  const tanLagna =
    1 /
    (Math.cos(lst * Math.PI / 180) /
      Math.tan(lat * Math.PI / 180) +
      Math.sin(lst * Math.PI / 180) *
      Math.tan(epsilon * Math.PI / 180));

  let asc = Math.atan(tanLagna) * 180 / Math.PI;

  asc = ((asc % 360) + 360) % 360;

  return asc;
}

/* -----------------------------
   House Assignment
----------------------------- */

export function assignHouses(planets, asc) {

  const planetData = {};

  Object.entries(planets).forEach(([planet, deg]) => {

    const house =
      Math.floor(((deg - asc + 360) % 360) / 30) + 1;

    planetData[planet] = {

      degree: deg.toFixed(2),

      sign: degreeToSign(deg),

      house,

      nakshatra: getNakshatra(deg)

    };

  });

  return planetData;
}