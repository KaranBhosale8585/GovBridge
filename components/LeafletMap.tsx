"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = { lat: number; lng: number };

const customIcon = new L.DivIcon({
  html: renderToStaticMarkup(<FaMapMarkerAlt size={32} color="red" />),
  className: "",
  iconAnchor: [16, 32],
});

function LocationMarker({
  position,
  setPosition,
}: {
  position: LatLng | null;
  setPosition: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

function RecenterMap({ position }: { position: LatLng }) {
  const map = useMap();
  map.setView(position, map.getZoom());
  return null;
}

export default function LeafletMap({
  position,
  setPosition,
}: {
  position: LatLng;
  setPosition: (pos: LatLng) => void;
}) {
  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <RecenterMap position={position} />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}
