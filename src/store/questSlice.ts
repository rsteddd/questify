import { createSlice, PayloadAction } from '@reduxjs/toolkit'; // Імпортуємо функції для створення слайсу
import { Quest } from '../types/quest'; // Імпортуємо типи Quest і QuestTask

// Початковий стан — порожній масив квестів
const initialState: Quest[] = [];

// Створюємо слайс для квестів
const questSlice = createSlice({
    name: 'quests', // Назва слайсу
    initialState, // Початковий стан
    reducers: {
        // Редюсер для додавання квесту
        addQuest: (state, action: PayloadAction<Quest>) => {
            state.push(action.payload); // Додаємо новий квест у масив
        },
        // Редюсер для перемикання стану завдання
        toggleTask: (
            state,
            action: PayloadAction<{ questId: string; taskId: string }>
        ) => {
            const { questId, taskId } = action.payload; // Отримуємо ID квесту й завдання
            const quest = state.find((q) => q.id === questId); // Знаходимо квест за ID
            if (quest) { // Якщо квест знайдено
                const task = quest.tasks.find((t) => t.id === taskId); // Знаходимо завдання за ID
                if (task) { // Якщо завдання знайдено
                    task.completed = !task.completed; // Перемикаємо стан completed
                }
            }
        },
    },
});

// Експортуємо екшени
export const { addQuest, toggleTask } = questSlice.actions;

// Експортуємо редюсер
export default questSlice.reducer;
