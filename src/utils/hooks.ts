import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';

export const useQuestStore = () => {
    const dispatch = useDispatch<AppDispatch>();
    const quests = useSelector((state: RootState) => state.quests);
    return { dispatch, quests };
};

export const useNavigation = () => {
    const navigate = useNavigate();
    return navigate;
};
