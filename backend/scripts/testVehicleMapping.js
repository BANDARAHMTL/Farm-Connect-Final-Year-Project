import axios from 'axios';

console.log('Testing vehicles API full response structure...\n');

try {
  const res = await axios.get('http://localhost:8080/api/vehicles');
  
  console.log('Full API Response:');
  console.log(JSON.stringify(res.data, null, 2));
  
  if (res.data.data && res.data.data.length > 0) {
    const vehicle = res.data.data[0];
    console.log('\n\nFORN MAPPING LOGIC (vehicleService.mapVehicle):');
    console.log('================================');
    
    // Simulate the mapVehicle function
    const mapped = {
      id: vehicle.id,
      type: vehicle.vehicleType || vehicle.vehicle_type || "Tractor",
      title: vehicle.model || vehicle.vehicleType || "Vehicle",
      ownerName: vehicle.ownerName || vehicle.owner_name || "",
      ownerMobile: vehicle.ownerMobile || vehicle.owner_mobile || "",
      regNumber: vehicle.regNumber || vehicle.reg_number || "",
      rating: vehicle.rating ?? 0,
      reviews: vehicle.reviews ?? 0,
      location: vehicle.location || "",
      pricePerAcre: Number(vehicle.pricePerAcre || vehicle.price_per_acre || 0),
      imageUrl: vehicle.imageUrl || vehicle.image_url || null,
      status: vehicle.status || "Available",
      // legacy keys
      image: vehicle.imageUrl || vehicle.image_url || "",
      owner_name: vehicle.ownerName || vehicle.owner_name || "",
      owner_mobile: vehicle.ownerMobile || vehicle.owner_mobile || "",
      reg_number: vehicle.regNumber || vehicle.reg_number || "",
      price_per_acre: Number(vehicle.pricePerAcre || vehicle.price_per_acre || 0),
    };
    
    console.log('MAPPED VEHICLE (Frontend will receive):');
    console.log(JSON.stringify(mapped, null, 2));
    
    console.log('\n================================');
    console.log('Fields in VehicleList.js rendering:');
    console.log('  title: ' + (mapped.title));
    console.log('  type: ' + (mapped.type));
    console.log('  pricePerAcre: ' + (mapped.pricePerAcre));
    console.log('  ownerName: ' + (mapped.ownerName));
    console.log('  ownerMobile: ' + (mapped.ownerMobile));
    console.log('  location: ' + (mapped.location));
    console.log('  regNumber: ' + (mapped.regNumber));
    console.log('  rating: ' + (mapped.rating));
    console.log('  reviews: ' + (mapped.reviews));
    console.log('  imageUrl: ' + (mapped.imageUrl));
    console.log('  status: ' + (mapped.status));
  }
} catch (err) {
  console.log('❌ Test failed:');
  console.log('   Status:', err.response?.status);
  console.log('   Message:', err.response?.data?.message || err.message);
}
