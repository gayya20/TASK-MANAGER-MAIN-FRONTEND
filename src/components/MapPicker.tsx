import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { Button, Input, Modal, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBi0P136eDUocBNtmBW37O9pBbWsij8ikY';

interface MapPickerProps {
  value?: {
    location: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  onChange?: (value: any) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ value, onChange }) => {
  const [address, setAddress] = useState(value?.location || '');
  const [coordinates, setCoordinates] = useState(value?.coordinates || { lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates({ lat, lng });
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results && results[0] && results[0].geometry && results[0].geometry.location) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        
        setCoordinates({ lat, lng });
        setAddress(results[0].formatted_address);
        
        // Center map on new location
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }
      } else {
        alert('Location not found. Please try a different search.');
      }
    });
  };

  const handleOk = () => {
    if (onChange) {
      onChange({
        location: address,
        coordinates
      });
    }
    setModalVisible(false);
  };

  return (
    <>
      <Input
        prefix={<EnvironmentOutlined />}
        placeholder="Click to select a location"
        value={address}
        readOnly
        onClick={() => setModalVisible(true)}
        style={{ cursor: 'pointer' }}
      />
      
      <Modal
        title="Select Location"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
          <Space>
            <Input 
              placeholder="Search for a location" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 300 }}
            />
            <Button type="primary" onClick={handleSearch}>Search</Button>
          </Space>
          
          <div>Selected: {address}</div>
        </Space>
        
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coordinates}
            zoom={15}
            onLoad={onMapLoad}
          >
            <Marker
              position={coordinates}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          </GoogleMap>
        </LoadScript>
      </Modal>
    </>
  );
};

export default MapPicker;