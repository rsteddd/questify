import React from 'react'; // Імпортуємо React
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Імпортуємо компоненти для маршрутизації
import { motion } from 'framer-motion'; // Імпортуємо motion для анімацій
import { useTranslation } from 'react-i18next'; // Імпортуємо хук для перекладів
import QuestForm from './components/quest/QuestForm'; // Імпортуємо компонент QuestForm
import QuestPage from './components/quest/QuestPage'; // Імпортуємо компонент QuestPage
import QuestList from './components/quest/QuestList'; // Імпортуємо компонент QuestList

// Головний компонент додатку
const App: React.FC = () => {
    const { t, i18n } = useTranslation(); // Отримуємо функцію t і об’єкт i18n для перекладів

    const changeLanguage = (lng: string) => i18n.changeLanguage(lng); // Функція для зміни мови

    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col overflow-hidden relative">
                {/* Контейнер для тайлів */}
                <div className="background-tiles">
                    <div className="tile-layer-1" />
                    <div className="tile-layer-2" />
                    <div className="mist" />
                </div>

                {/* Герой-секція */}
                <header className="hero-section relative z-10">
                    <Link to="/">
                        <motion.h1 // Анімований заголовок
                            className="hero-title" // Стилі для заголовка
                            initial={{ opacity: 0, y: 20 }} // Початковий стан
                            animate={{ opacity: 1, y: 0 }} // Кінцевий стан
                            transition={{ duration: 0.8 }} // Тривалість анімації
                        >
                            {t('title')}
                        </motion.h1>
                    </Link>
                    <motion.p // Анімований підзаголовок
                        className="hero-subtitle" // Стилі для підзаголовка
                        initial={{ opacity: 0, y: 20 }} // Початковий стан
                        animate={{ opacity: 1, y: 0 }} // Кінцевий стан
                        transition={{ duration: 0.8, delay: 0.2 }} // Тривалість і затримка
                    >
                        {t('subtitle')}
                    </motion.p>
                    <div className="language-switcher">
                        {['en', 'uk'].map((lang) => ( // Перебираємо мови
                            <button // Кнопка для кожної мови
                                key={lang} // Унікальний ключ
                                onClick={() => changeLanguage(lang)} // Змінюємо мову при кліку
                                className={`language-btn ${i18n.language === lang ? 'active' : ''}`} // Стилі з умовним класом
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Основний контент */}
                <main className="flex-grow relative z-10 px-4 py-8">
                    <Routes>
                        <Route // Маршрут для головної сторінки
                            path="/" // Шлях "/"
                            element={ // Елемент для рендерингу
                                <div className="space-y-8">
                                    <QuestForm />
                                    <QuestList />
                                </div>
                            }
                        />
                        <Route path="/quest/:id" element={<QuestPage />} />
                    </Routes>
                </main>

                {/* Футер */}
                {/*<footer className="text-center py-6 bg-gray-900/80 text-gray-400 relative z-10"> // Футер*/}
                {/*    <p>{t('footer')}</p> // Текст "Made with ❤️ by Vlad" або переклад*/}
                {/*    <a // Посилання на Buy Me a Coffee*/}
                {/*        href="https://www.buymeacoffee.com/yourusername" }
                {/*        target="_blank" }
                {/*        rel="noopener noreferrer" }
                {/*        className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all" // Стилі*/}
                {/*    >*/}
                {/*        {t('buyMeCoffee')} }
                {/*    </a>*/}
                {/*</footer>*/}
            </div>
        </Router>
    );
};

export default App; // Експортуємо компонент
