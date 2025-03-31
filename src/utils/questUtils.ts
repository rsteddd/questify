import { QuestTask } from '../types/quest';

export const generateTasks = (
    weather: string,
    locations: string[],
    theme: string,
    type: 'Adventure' | 'Puzzle' | 'Exploration',
    t: (key: string, options?: Record<string, string>) => string
): QuestTask[] => {
    const taskTemplates = {
        Fantasy: {
            Adventure: [
                t('fantasyTask1', { location: locations[0] || 'enchanted forest', weather: weather || 'mystical' }),
                t('fantasyTask2', { location: locations[1] || 'crystal river' }),
                t('fantasyTask3', { location: locations[2] || 'dragon peak' }),
                t('fantasyTask4', { location: locations[0] || 'hidden valley', weather: weather || 'foggy' }),
            ],
            Puzzle: [
                t('fantasyPuzzle1', { location: locations[0] || 'ancient ruins', weather: weather || 'stormy' }),
                t('fantasyPuzzle2', { location: locations[1] || 'forgotten temple' }),
                t('fantasyPuzzle3', { location: locations[2] || 'cursed crypt' }),
                t('fantasyPuzzle4', { location: locations[0] || 'mystic cave' }),
            ],
            Exploration: [
                t('fantasyExplore1', { location: locations[0] || 'shadow woods', weather: weather || 'twilight' }),
                t('fantasyExplore2', { location: locations[1] || 'elven ruins' }),
                t('fantasyExplore3', { location: locations[2] || 'forbidden cliffs' }),
                t('fantasyExplore4', { location: locations[0] || 'lost kingdom' }),
            ],
        },
        Detective: {
            Adventure: [
                t('detectiveTask1', { location: locations[0] || 'central plaza', weather: weather || 'rainy' }),
                t('detectiveTask2', { location: locations[1] || 'shady alley' }),
                t('detectiveTask3', { location: locations[2] || 'old mansion' }),
                t('detectiveTask4', { location: locations[0] || 'harbor docks', weather: weather || 'foggy' }),
            ],
            Puzzle: [
                t('detectivePuzzle1', { location: locations[0] || 'dusty archive', weather: weather || 'gloomy' }),
                t('detectivePuzzle2', { location: locations[1] || 'crime scene' }),
                t('detectivePuzzle3', { location: locations[2] || 'locked office' }),
                t('detectivePuzzle4', { location: locations[0] || 'secret basement' }),
            ],
            Exploration: [
                t('detectiveExplore1', { location: locations[0] || 'city outskirts', weather: weather || 'dreary' }),
                t('detectiveExplore2', { location: locations[1] || 'underground club' }),
                t('detectiveExplore3', { location: locations[2] || 'abandoned factory' }),
                t('detectiveExplore4', { location: locations[0] || 'haunted district' }),
            ],
        },
        SciFi: {
            Adventure: [
                t('sciFiTask1', { location: locations[0] || 'orbital dock', weather: weather || 'cosmic' }),
                t('sciFiTask2', { location: locations[1] || 'space elevator' }),
                t('sciFiTask3', { location: locations[2] || 'alien outpost' }),
                t('sciFiTask4', { location: locations[0] || 'starship wreck', weather: weather || 'radiant' }),
            ],
            Puzzle: [
                t('sciFiPuzzle1', { location: locations[0] || 'control hub', weather: weather || 'electric' }),
                t('sciFiPuzzle2', { location: locations[1] || 'holo archive' }),
                t('sciFiPuzzle3', { location: locations[2] || 'quantum gate' }),
                t('sciFiPuzzle4', { location: locations[0] || 'cyber vault' }),
            ],
            Exploration: [
                t('sciFiExplore1', { location: locations[0] || 'meteor field', weather: weather || 'stellar' }),
                t('sciFiExplore2', { location: locations[1] || 'graviton rift' }),
                t('sciFiExplore3', { location: locations[2] || 'ruined biodome' }),
                t('sciFiExplore4', { location: locations[0] || 'uncharted planet' }),
            ],
        },
    };
    const tasks = taskTemplates[theme as keyof typeof taskTemplates]?.[type] || taskTemplates.Fantasy.Adventure;
    return tasks.slice(0, 3).map((desc) => ({
        id: crypto.randomUUID(),
        description: desc,
        completed: false,
    }));
};
