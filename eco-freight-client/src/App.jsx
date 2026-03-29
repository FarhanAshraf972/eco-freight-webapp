import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, X, Truck, Leaf, Loader2 } from 'lucide-react';

// --- Haversine Formula Utility ---
// Calculates the distance between two latitude/longitude points in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c); // Distance in km
};

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for API calls

  // ENVIRONMENT VARIABLE SETUP:
  // Uses Vercel's live URL if deployed, or falls back to localhost during local development
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchShipments = async () => {
    try {
      // Updated to use dynamic API_BASE
      const res = await axios.get(`${API_BASE}/api/shipments/all`);
      setShipments(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (showDashboard) fetchShipments();
  }, [showDashboard]);

  // Handle Form Submission with Auto-Distance & Auto-ID
  const handleAddShipment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      // 1. Auto-generate a unique Order ID
      const generatedOrderId = `EF-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Fetch coordinates
      const originRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${data.origin}`);
      const destRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${data.destination}`);

      if (originRes.data.length === 0 || destRes.data.length === 0) {
        alert("Could not locate one or both of the cities. Please check the spelling.");
        setIsSubmitting(false);
        return;
      }

      // 3. Calculate distance
      const calculatedDistance = calculateDistance(
        parseFloat(originRes.data[0].lat), parseFloat(originRes.data[0].lon),
        parseFloat(destRes.data[0].lat), parseFloat(destRes.data[0].lon)
      );

      // 4. STRICTLY FORMAT THE PAYLOAD FOR MONGOOSE
      const payload = {
        orderId: generatedOrderId,
        origin: data.origin,
        destination: data.destination,
        weightKg: Number(data.weightKg), // Forces string to Number
        distanceKm: Number(calculatedDistance), // Ensures Number
        transportMode: data.transportMode
      };

      console.log("Sending clean payload to backend:", payload);

      // 5. Save to database using dynamic API_BASE
      await axios.post(`${API_BASE}/api/shipments/add`, payload);
      
      setShowForm(false);
      fetchShipments(); 
    } catch (err) {
      // Better error catching so we know EXACTLY what failed
      const serverResponse = err.response?.data?.message || err.response?.data || "Unknown Error";
      alert(`Backend rejected the save. Reason: ${JSON.stringify(serverResponse)}`);
      console.error("Detailed server error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showDashboard) {
    return <LandingPage onStart={() => setShowDashboard(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Eco-Freight Intelligence</h1>
            <p className="text-sm text-slate-500 font-medium">Logistics Emission Tracking & Optimization</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-eco-green text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-opacity-90 shadow-sm transition"
            >
              {showForm ? <X size={20}/> : <Plus size={20}/>}
              {showForm ? "Close" : "New Shipment"}
            </button>
            <button onClick={() => setShowDashboard(false)} className="text-slate-400 hover:text-slate-600 underline text-sm">Logout</button>
          </div>
        </div>

        {/* Add Shipment Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-eco-green/20 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-eco-dark">
              <Truck size={20}/> Register New Consignment
            </h2>
            <form onSubmit={handleAddShipment} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input name="origin" placeholder="Origin City (e.g. Paris)" className="p-2 border rounded-md focus:ring-2 focus:ring-eco-green outline-none" required disabled={isSubmitting} />
              <input name="destination" placeholder="Destination City (e.g. Berlin)" className="p-2 border rounded-md focus:ring-2 focus:ring-eco-green outline-none" required disabled={isSubmitting} />
              <input name="weightKg" type="number" placeholder="Weight (kg)" className="p-2 border rounded-md focus:ring-2 focus:ring-eco-green outline-none" required disabled={isSubmitting} />
              <select name="transportMode" className="p-2 border rounded-md bg-white focus:ring-2 focus:ring-eco-green outline-none" required disabled={isSubmitting}>
                <option value="Heavy Truck">Heavy Truck</option>
                <option value="Air">Air Freight</option>
                <option value="Cargo Ship">Cargo Ship</option>
                <option value="Rail">Rail</option>
              </select>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="md:col-span-2 lg:col-span-4 bg-eco-dark text-white p-2 rounded-md font-bold hover:bg-slate-800 transition shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Calculating Route & Emissions...</>
                ) : (
                  "Calculate & Save to Ledger"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Summary Cards */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-eco-green">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Shipments</p>
              <p className="text-4xl font-black text-slate-800">{shipments.length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total CO₂ Footprint</p>
              <p className="text-4xl font-black text-slate-800">
                {shipments.reduce((acc, curr) => acc + curr.carbonEmitted, 0).toFixed(1)} <span className="text-lg font-normal text-slate-400 font-sans tracking-normal">kg</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-amber-400">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Optimization Potential</p>
              <p className="text-3xl font-black text-amber-600">
                -{shipments.reduce((acc, curr) => acc + (curr.suggestedSavings || 0), 0).toFixed(1)} 
                <span className="text-sm ml-1 uppercase font-normal text-slate-400">kg CO₂</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-2 italic leading-tight">Possible savings by switching high-impact routes to Rail/Sea</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm min-h-[350px]">
            <h2 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
              <BarChart3 className="text-eco-green" size={18} /> Emissions Profile by Shipment
            </h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={shipments}>
                <XAxis dataKey="orderId" hide />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="carbonEmitted" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 font-bold text-slate-700">Recent Logistics Data</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Route & Distance</th>
                  <th className="p-4 font-bold">Transport Mode</th>
                  <th className="p-4 font-bold">Net Weight</th>
                  <th className="p-4 font-bold text-right text-eco-dark">CO₂ Impact / Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map(s => (
                  <tr key={s._id} className="hover:bg-slate-50/80 transition group">
                    <td className="p-4 font-mono text-xs text-eco-dark font-bold">{s.orderId}</td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {s.origin} to {s.destination}
                      <span className="block text-xs text-slate-400 font-normal">{s.distanceKm} km</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.transportMode === 'Air' ? 'bg-red-50 text-red-600' : 'bg-eco-light text-eco-dark'
                      }`}>
                        {s.transportMode}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{s.weightKg} kg</td>
                    <td className="p-4 text-right border-l border-transparent group-hover:border-slate-100">
                      <div className="font-bold text-slate-800">{s.carbonEmitted} kg</div>
                      {s.suggestedSavings > 0 && (
                        <div className="text-[10px] text-eco-green font-bold flex items-center justify-end gap-1 mt-0.5">
                          <Leaf size={10} fill="currentColor" /> Save {s.suggestedSavings}kg via {s.suggestedMode || 'Rail'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shipments.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">No shipment data available. Add your first consignment to see insights.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal icon for the header
function BarChart3({ size, className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
}

export default App;