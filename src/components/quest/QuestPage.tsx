import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuestStore } from '../../utils/hooks';
import { toggleTask } from '../../store/questSlice';
import { getTimeLeftToday } from '../../utils/dateUtils';
import {LatLngTuple,Map} from "leaflet";

const QuestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { dispatch, quests } = useQuestStore();
    const quest = quests.find((q) => q.id === id);
    const [timeLeft, setTimeLeft] = useState<string>(getTimeLeftToday());
    const { t } = useTranslation();
    const mapRef = useRef<Map | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Встановлюємо клієнтський рендеринг
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(getTimeLeftToday()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isClient && mapRef.current) { // Перевіряємо, чи ми на клієнті й чи є реф
            mapRef.current.invalidateSize(); // Перемальовуємо карту
        }
    }, [quest, isClient]);

    if (!quest) {
        return <p className="text-center text-gray-500 mt-8 italic">{t('questNotFound')}</p>;
    }

    const handleTaskToggle = (taskId: string) => {
        dispatch(toggleTask({ questId: quest.id, taskId }));
    };

    const progress = (quest.tasks.filter((t) => t.completed).length / quest.tasks.length) * 100;
    const center: LatLngTuple =
        quest.locations.length > 0 && quest.locations[0].lat && quest.locations[0].lon
            ? [quest.locations[0].lat, quest.locations[0].lon]
            : [50.45, 30.52];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-md mx-auto mt-8 bg-gray-900/80 rounded-xl shadow-xl border border-gray-800/50"
        >
            <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                {quest.title}
            </h2>
            <div className="space-y-2 text-gray-300">
                {[
                    { label: 'type', value: t(quest.type.toLowerCase()) },
                    { label: 'theme', value: t(quest.theme.toLowerCase()) },
                    { label: 'city', value: quest.city },
                    { label: 'weather', value: quest.weather },
                    { label: 'locations', value: quest.locations.map((loc) => loc.name).join(', ') || 'N/A' },
                    { label: 'timeLeft', value: timeLeft },
                    { label: 'progress', value: `${Math.round(progress)}%` },
                ].map(({ label, value }) => (
                    <p key={label}>
                        <span className="font-semibold text-gray-200">{t(label)}:</span> {value}
                    </p>
                ))}
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {isClient && ( // Карта рендериться тільки на клієнті
                <div className="map-wrapper" style={{ height: '300px', width: '100%' }}> {/* Явно задаємо розміри */}
                    <MapContainer
                        center={center}
                        zoom={13}
                        ref={mapRef}
                        className="h-full w-full" // Змінено className для повного заповнення
                        style={{ height: '100%', width: '100%' }} // Додано style для впевненості
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {quest.locations
                            .filter((loc) => loc.lat && loc.lon)
                            .map((loc, index) => (
                                <Marker key={index} position={[loc.lat, loc.lon]}>
                                    <Popup>
                                        <strong>{loc.name}</strong>
                                        <p>{quest.tasks[index]?.description || t('noTask')}</p>
                                    </Popup>
                                </Marker>
                            ))}
                    </MapContainer>
                </div>
            )}

            <ul className="mt-6 space-y-4">
                {quest.tasks.map((task) => (
                    <motion.li
                        key={task.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600"
                    >
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(task.id)}
                            className="mr-3 h-5 w-5 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                        />
                        <span className={task.completed ? 'line-through text-gray-500' : 'text-white'}>
              {task.description}
            </span>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

export default QuestPage;
