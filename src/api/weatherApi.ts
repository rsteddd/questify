import axios from 'axios';

// const API_KEY = 'c2f89f24d96d44e2862213955253003'; // Заміни на свій ключ

export const fetchWeather = async (city: string): Promise<string> => {
    try {
        const response = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=c2f89f24d96d44e2862213955253003&q=${city}`
        );
        return response.data.current.condition.text;
    } catch (error) {
        console.error('Weather API error:', error);
        return 'Unknown';
    }
};
