import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuestStore } from '../../utils/hooks';

const QUESTS_PER_PAGE = 4;

const QuestList: React.FC = () => {
    const { quests } = useQuestStore();
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { t } = useTranslation();


    const filteredQuests = quests.filter((quest) => {
        if (filter === 'All') return true;
        const isCompleted = quest.tasks.every((task) => task.completed);
        return filter === 'Completed' ? isCompleted : !isCompleted;
    });
    const totalPages = Math.ceil(filteredQuests.length / QUESTS_PER_PAGE);
    const startIndex = (currentPage - 1) * QUESTS_PER_PAGE;
    const paginatedQuests = filteredQuests.slice(startIndex, startIndex + QUESTS_PER_PAGE);

    if (quests.length === 0) {
        return <p className="text-center text-gray-500 mt-8 italic">{t('noQuests')}</p>;
    }

    return (
        <div className="p-6 max-w-md mx-auto mt-4">
            <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent text-center">
                {t('yourQuests')}
            </h2>
            <div className="flex justify-center space-x-4 mb-6">
                {(['All', 'Active', 'Completed'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            filter === f
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {t(f.toLowerCase())}
                    </button>
                ))}
            </div>
            <ul className="space-y-4">
                {paginatedQuests.map((quest, index) => (
                    <motion.li
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-gray-900/80 rounded-xl shadow-md border border-gray-800/50 hover:shadow-lg transition-shadow"
                    >
                        <a
                            href={`/quest/${quest.id}`}
                            className="text-white font-semibold hover:text-purple-400 transition-colors"
                        >
                            {quest.title} ({t(quest.theme.toLowerCase())})
                        </a>
                        <p className="text-gray-400 text-sm mt-1">
                            {quest.tasks.every((t) => t.completed) ? t('completed') : t('active')}
                        </p>
                    </motion.li>
                ))}
            </ul>
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-all"
                    >
                        {t('previous')}
                    </button>
                    <span className="text-gray-300">
            {t('page')} {currentPage} {t('of')} {totalPages}
          </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-all"
                    >
                        {t('next')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuestList;
