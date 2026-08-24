import requests

OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]


def fetch_hospitals_from_osm(lat, lon, radius_km=5):
    headers = {
        "User-Agent": "ai-clinic-backend/1.0 (rural clinic diagnostics app)",
        "Accept": "application/json",
    }

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

    data = None
    last_error = None
    for endpoint in OVERPASS_ENDPOINTS:
        try:
            response = requests.post(endpoint, data={"data": query}, headers=headers, timeout=60)
            response.raise_for_status()
            data = response.json()
            break
        except requests.RequestException as e:
            last_error = e
            continue

    if data is None:
        raise RuntimeError(f"All Overpass endpoints failed, last error: {last_error}")

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
