from app.models import Business, HospitalMarker
from app import db
from app.client.osm_client import fetch_hospitals_from_osm


from app.models import HospitalMarker
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Radius of Earth in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def getAmenityInfo(latitude, longitude, radius_km):
    # Validate radius
    if radius_km < 1:
        radius_km = 1
    elif radius_km > 10:
        radius_km = 10

    # Bounding box calculation
    lat_radius = radius_km / 111.0
    lon_radius = radius_km / (111.0 * math.cos(math.radians(latitude)))

    min_lat = latitude - lat_radius
    max_lat = latitude + lat_radius
    min_lon = longitude - lon_radius
    max_lon = longitude + lon_radius

    # Query hospital markers within bounding box
    hospitalMarkers = HospitalMarker.query.filter(
        HospitalMarker.lat.between(min_lat, max_lat),
        HospitalMarker.lng.between(min_lon, max_lon)
    ).all()
    if len(hospitalMarkers) == 0 or len(hospitalMarkers) < 5 or hospitalMarkers is None:
        # Fetch from OSM if no markers found
        fetch_amenity_list = fetch_hospitals_from_osm(latitude, longitude, radius_km)
        save_hospitals(fetch_amenity_list)
    # Precise distance filter
    amenity_list = []
    for hospital in hospitalMarkers:
        dist = haversine_distance(latitude, longitude, hospital.lat, hospital.lng)
        if dist <= radius_km:
            amenity_list.append({
                "id": hospital.id,
                "name": hospital.name,
                "marker_id": hospital.marker_id,
                "latitude": hospital.lat,
                "longitude": hospital.lng,
                "distance_km": round(dist, 2),
                "address": hospital.address,
                "phone": hospital.phone,
                "website": hospital.website
            })
    return amenity_list
        
        
        


def save_hospitals(hospitals_data):
    for hospital in hospitals_data:
        try:
            marker_id = str(hospital.get('id'))

            # Check if marker already exists
            existing = HospitalMarker.query.filter_by(marker_id=marker_id).first()
            if existing:
                continue  # Skip duplicates

            new_marker = HospitalMarker(
                marker_id=marker_id,
                business_id=None,  # or some default if required
                name=hospital.get('name'),
                phone=hospital.get('phone'),
                email=hospital.get('email'),
                website=hospital.get('website'),
                address=hospital.get('address'),
                hours=hospital.get('hours'),
                lat=hospital.get('lat'),
                lng=hospital.get('lon'),
                amenity='hospital',
                type='public'  # or determine dynamically
            )

            db.session.add(new_marker)
        except Exception as e:
            print(f"Error saving hospital {hospital.get('name')}: {e}")

    db.session.commit()

