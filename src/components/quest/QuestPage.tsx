import React, { useState, useEffect, useRef } from 'react'; // Імпортуємо React і хуки
import { useParams } from 'react-router-dom'; // Імпортуємо хук для параметрів URL
import { motion } from 'framer-motion'; // Імпортуємо motion для анімацій
import { useTranslation } from 'react-i18next'; // Імпортуємо хук для перекладів
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'; // Імпортуємо компоненти Leaflet
import { useQuestStore } from '../../utils/hooks'; // Імпортуємо кастомний хук для Redux
import { toggleTask } from '../../store/questSlice'; // Імпортуємо екшен для зміни стану завдання
import { getTimeLeftToday } from '../../utils/dateUtils';
import {LatLngTuple, Map} from "leaflet"; // Імпортуємо утиліту для часу

// Компонент QuestPage для відображення сторінки квесту
const QuestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Отримуємо ID квесту з URL
    const { dispatch, quests } = useQuestStore(); // Отримуємо dispatch і список квестів із Redux
    const quest = quests.find((q) => q.id === id); // Знаходимо квест за ID
    const [timeLeft, setTimeLeft] = useState<string>(getTimeLeftToday()); // Стан для часу до кінця дня
    const { t } = useTranslation(); // Отримуємо функцію t для перекладів
    const mapRef = useRef<Map | null>(null); // Реф для доступу до об’єкта карти Leaflet із типом Map
    const [isClient, setIsClient] = useState(false); // Стан для перевірки клієнтського рендерингу

    useEffect(() => { // Ефект для ініціалізації клієнтського рендерингу
        setIsClient(true); // Встановлюємо, що ми на клієнті
    }, []); // Виконуємо один раз при монтуванні

    useEffect(() => { // Ефект для таймера
        const timer = setInterval(() => setTimeLeft(getTimeLeftToday()), 60000); // Оновлюємо час кожну хвилину
        return () => clearInterval(timer); // Очищаємо таймер при розмонтуванні
    }, []); // Виконуємо один раз

    useEffect(() => { // Ефект для інвалідизації карти
        if (mapRef.current) { // Якщо реф карти доступний
            mapRef.current.invalidateSize(); // Перемальовуємо карту для коректного відображення
        }
    }, [quest, isClient]); // Залежність від quest і isClient

    if (!quest) { // Перевіряємо, чи знайдено квест
        return <p className="text-center text-gray-500 mt-8 italic">{t('questNotFound')}</p>; // Повідомлення, якщо квест не знайдено
    }

    const handleTaskToggle = (taskId: string) => { // Функція для перемикання стану завдання
        dispatch(toggleTask({ questId: quest.id, taskId })); // Викликаємо екшен для зміни completed
    };

    const progress = (quest.tasks.filter((t) => t.completed).length / quest.tasks.length) * 100; // Розраховуємо прогрес у відсотках
    const center: LatLngTuple = // Визначаємо центр карти
        quest.locations.length > 0 && quest.locations[0].lat && quest.locations[0].lon // Перевіряємо валідність координат
            ? [quest.locations[0].lat, quest.locations[0].lon] // Беремо першу локацію
            : [50.45, 30.52]; // Запасний центр — Київ

    return (
        <motion.div // Контейнер із анімацією
            initial={{ opacity: 0 }} // Початковий стан: невидимий
            animate={{ opacity: 1 }} // Кінцевий стан: видимий
            transition={{ duration: 0.5 }} // Тривалість анімації
            className="p-6 max-w-md mx-auto mt-8 bg-gray-900/80 rounded-xl shadow-xl border border-gray-800/50" // Стилі контейнера
        >
            <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                {quest.title}
            </h2>
            <div className="space-y-2 text-gray-300">
                {[
                    { label: 'type', value: t(quest.type.toLowerCase()) }, // Тип квесту
                    { label: 'theme', value: t(quest.theme.toLowerCase()) }, // Тема квесту
                    { label: 'city', value: quest.city }, // Місто
                    { label: 'weather', value: quest.weather }, // Погода
                    { label: 'locations', value: quest.locations.map((loc) => loc.name).join(', ') || 'N/A' }, // Локації
                    { label: 'timeLeft', value: timeLeft }, // Час до кінця дня
                    { label: 'progress', value: `${Math.round(progress)}%` }, // Прогрес
                ].map(({ label, value }) => ( // Перебираємо метадані
                    <p key={label}>
                        <span className="font-semibold text-gray-200">{t(label)}:</span> {value}
                    </p>
                ))}
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div // Анімований прогрес-бар
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" // Стилі
                        initial={{ width: 0 }} // Початкова ширина
                        animate={{ width: `${progress}%` }} // Кінцева ширина
                        transition={{ duration: 0.5 }} // Тривалість анімації
                    />
                </div>
            </div>

            {isClient && ( // Рендеримо карту тільки на клієнті
                <div className="map-wrapper">
                    <MapContainer
                        center={center} // Центр карти
                        zoom={13} // Початковий зум
                        ref={mapRef} // Передаємо реф для доступу до карти
                        className="leaflet-container" // Клас для стилів
                        style={{ height: '300px', width: '100%' }} // Явно задаємо розміри
                    >
                        <TileLayer // Шар із тайлами OpenStreetMap
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL тайлів
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Атрибуція
                        />
                        {quest.locations
                            .filter((loc) => loc.lat && loc.lon) // Фільтруємо валідні координати
                            .map((loc, index) => ( // Перебираємо локації для маркерів
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
                {quest.tasks.map((task) => ( // Перебираємо завдання
                    <motion.li // Елемент списку з анімацією
                        key={task.id} // Унікальний ключ
                        initial={{ x: -20, opacity: 0 }} // Початковий стан
                        animate={{ x: 0, opacity: 1 }} // Кінцевий стан
                        transition={{ duration: 0.3 }} // Тривалість анімації
                        className="flex items-center text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600" // Стилі
                    >
                        <input // Чекбокс для завдання
                            type="checkbox" // Тип чекбокс
                            checked={task.completed} // Стан чекбокса
                            onChange={() => handleTaskToggle(task.id)} // Перемикаємо стан
                            className="mr-3 h-5 w-5 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500" // Стилі
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

export default QuestPage; // Експортуємо компонент
