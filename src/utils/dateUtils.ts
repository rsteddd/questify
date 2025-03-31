// Функція для обчислення часу до кінця дня
export const getTimeLeftToday = (): string => {
    const now = new Date(); // Отримуємо поточну дату й час
    const midnight = new Date(now); // Копіюємо поточну дату
    midnight.setHours(24, 0, 0, 0); // Встановлюємо північ наступного дня

    const diffMs = midnight.getTime() - now.getTime(); // Різниця в мілісекундах
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Переводимо в години
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Залишок у хвилинах

    return `${diffHours}h ${diffMinutes}m`; // Повертаємо у форматі "Xh Ym"
};
