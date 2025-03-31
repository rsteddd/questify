import { LocationData } from '../api/nominatimApi'; // Імпортуємо тип LocationData

// Інтерфейс для завдання квесту
export interface QuestTask {
    id: string; // Унікальний ID завдання
    description: string; // Опис завдання
    completed: boolean; // Статус завершення
}

// Інтерфейс для квесту
export interface Quest {
    id: string; // Унікальний ID квесту
    title: string; // Назва квесту
    city: string; // Місто квесту
    type: 'Adventure' | 'Puzzle' | 'Exploration'; // Тип квесту
    theme: 'Fantasy' | 'Detective' | 'SciFi'; // Тема квесту
    tasks: QuestTask[]; // Список завдань
    createdAt: string; // Дата створення
    weather: string; // Погода
    locations: LocationData[]; // Локації з координатами
}
