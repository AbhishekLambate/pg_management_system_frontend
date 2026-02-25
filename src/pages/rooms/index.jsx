import React, { useState } from 'react';
import { MapPin, Building2, DoorOpen } from 'lucide-react';
import LocationsTab from './LocationsTab';
import BuildingsTab from './BuildingsTab';
import RoomsTab from './RoomsTab';

const TABS = [
    { key: 'locations', label: 'Locations', icon: MapPin },
    { key: 'buildings', label: 'Buildings', icon: Building2 },
    { key: 'rooms', label: 'Rooms', icon: DoorOpen },
];

const Rooms = () => {
    const [activeTab, setActiveTab] = useState('locations');

    return (
        <>
            {/* Page Heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Rooms</h1>
                <p className="text-slate-400 text-sm mt-1">
                    Manage locations, buildings and rooms in your PG.
                </p>
            </div>

            {/* Tab Nav */}
            <div
                className="flex gap-1 mb-6 p-1 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}
            >
                {TABS.map(({ key, label, icon: Icon }) => {
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 18px', borderRadius: '10px', border: 'none',
                                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                                transition: 'all 0.2s',
                                background: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
                                color: isActive ? '#a5b4fc' : 'rgba(148,163,184,0.8)',
                                boxShadow: isActive ? '0 0 0 1px rgba(99,102,241,0.4)' : 'none',
                            }}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'locations' && <LocationsTab />}
            {activeTab === 'buildings' && <BuildingsTab />}
            {activeTab === 'rooms' && <RoomsTab />}
        </>
    );
};

export default Rooms;
