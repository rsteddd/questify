import axios from 'axios'; // Імпортуємо axios для HTTP-запитів

// Інтерфейс для даних про локацію
export interface LocationData {
    name: string; // Назва локації (наприклад, "Kyiv")
    lat: number; // Широта (latitude)
    lon: number; // Довгота (longitude)
}

// Функція для отримання локацій за назвою міста
export const fetchLocations = async (city: string): Promise<LocationData[]> => {
    try { // Починаємо блок try для обробки помилок
        const response = await axios.get( // Виконуємо GET-запит до Nominatim API
            `https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=3` // URL із назвою міста, формат JSON, ліміт 3 результати
        );
        return response.data.map((item: any) => ({ // Перетворюємо кожен елемент відповіді в об’єкт LocationData
            name: item.display_name.split(',')[0], // Беремо першу частину назви (до коми)
            lat: parseFloat(item.lat), // Перетворюємо широту в число
            lon: parseFloat(item.lon), // Перетворюємо довготу в число
        }));
    } catch (error) { // Ловимо помилки, якщо запит не вдався
        console.error('Nominatim API error:', error); // Логуємо помилку в консоль
        return [{ name: city, lat: 0, lon: 0 }]; // Повертаємо запасний варіант із назвою міста й нульовими координатами
    }
};
