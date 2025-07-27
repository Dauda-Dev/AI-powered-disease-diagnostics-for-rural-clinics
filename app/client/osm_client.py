import requests

def fetch_hospitals_from_osm(lat, lon, radius_km=5):
    overpass_url = "https://overpass-api.de/api/interpreter"

    # Overpass QL query to find hospitals within a radius of (lat, lon)
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:{radius_km * 1000},{lat},{lon});
      way["amenity"="hospital"](around:{radius_km * 1000},{lat},{lon});
      relation["amenity"="hospital"](around:{radius_km * 1000},{lat},{lon});
    );
    out center;
    """

    response = requests.get(overpass_url, params={'data': query})
    response.raise_for_status()
    data = response.json()

    hospitals = []

    for el in data.get("elements", []):
        if el["type"] == "node":
            coords = {"lat": el["lat"], "lon": el["lon"]}
        else:  # way or relation
            coords = {"lat": el["center"]["lat"], "lon": el["center"]["lon"]}

        tags = el.get("tags", {})

        hospital = {
            "id": el.get("id"),
            "name": tags.get("name", "Unnamed Hospital"),
            "phone": tags.get("phone") or tags.get("contact:phone", ""),
            "email": tags.get("email") or tags.get("contact:email", ""),
            "website": tags.get("website") or tags.get("contact:website", ""),
            "address": ", ".join(filter(None, [
                tags.get("addr:street"),
                tags.get("addr:city"),
                tags.get("addr:postcode")
            ])),
            "hours": tags.get("opening_hours", ""),
            **coords
        }

        hospitals.append(hospital)

    return hospitals
