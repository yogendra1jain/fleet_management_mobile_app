import NavigationService from '../navigators/NavigationService';

export const navigateToHome = (dispatch) => {
    console.log('came in navigation helper');
    NavigationService.navigate('Home');
};
