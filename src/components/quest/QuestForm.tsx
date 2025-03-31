import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuestStore, useNavigation } from '../../utils/hooks';
import { addQuest } from '../../store/questSlice';
import { fetchWeather } from '../../api/weatherApi';
import { fetchLocations } from '../../api/nominatimApi';
import { generateTasks } from '../../utils/questUtils';
import Input from '../common/Input';
import QuestButton from '../common/QuestButton';

const QuestForm: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [type, setType] = useState<'Adventure' | 'Puzzle' | 'Exploration'>('Adventure');
    const [theme, setTheme] = useState<'Fantasy' | 'Detective' | 'SciFi'>('Fantasy');
    const { dispatch } = useQuestStore();
    const navigate = useNavigation();
    const { t } = useTranslation();

    const handleSubmit = async () => {
        if (!city) {
            alert(t('errorCity'));
            return;
        }

        const weather = await fetchWeather(city);
        const locations = await fetchLocations(city);
        const locationNames = locations.map((loc) => loc.name);
        const tasks = generateTasks(weather, locationNames, theme, type, t);

        const quest = {
            id: crypto.randomUUID(),
            title: `${t(theme.toLowerCase())} Quest in ${city}`,
            city,
            type,
            theme,
            tasks,
            createdAt: new Date().toISOString().split('T')[0],
            weather,
            locations,
        };

        dispatch(addQuest(quest));
        navigate(`/quest/${quest.id}`);
        setCity('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-900/80 rounded-xl shadow-xl max-w-md mx-auto mt-8 border border-gray-800/50"
        >
            <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent text-center">
                {t('createQuest')}
            </h2>
            <div className="space-y-4">
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('enterCity')} />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'Adventure' | 'Puzzle' | 'Exploration')}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <option value="Adventure">{t('adventure')}</option>
                    <option value="Puzzle">{t('puzzle')}</option>
                    <option value="Exploration">{t('exploration')}</option>
                </select>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'Fantasy' | 'Detective' | 'SciFi')}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <option value="Fantasy">{t('fantasy')}</option>
                    <option value="Detective">{t('detective')}</option>
                    <option value="SciFi">{t('sciFi')}</option>
                </select>
                <QuestButton onClick={handleSubmit}>{t('generateQuest')}</QuestButton>
            </div>
        </motion.div>
    );
};

export default QuestForm;
