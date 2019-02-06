import React from 'react';
import { Text, View, Image } from 'react-native';
import serviceImg from '../assets/images/serviceImg.png';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeContentScreen from '../components/HomeContentScreen';

import UserAccountScreen from '../components/user/UserAccountScreen';
import EditUserProfileScreen from '../components/user/EditUserProfileScreen';
import SetupNativeAuthScreen from '../components/auth/SetupNativeAuthScreen';
import NativeAuthEntryScreen from '../components/auth/NativeAuthEntryScreen';
import ChangePasswordScreen from '../components/auth/ChangePasswordScreen';
import TaskListScreen from '../components/tasks/taskList';
import TaskDetailScreen from '../components/tasks/taskDetail';
import LocationMap from '../components/MapView/LocationMap';
import LocationA from '../components/MapView/MultipleLocation';
import UpdateMileageHome from '../components/UpdateMileage/UpdateMileageHome';
import ServiceTicketHome from '../components/ServiceTickets/ServiceTicketHome';
import ContactPersonHome from '../components/ContactPerson/ContactPersonHome';
import DocumentsHome from '../components/DocumentsView/DocumentsHome';
import GasFilUpHome from '../components/GasFilUp/GasFilupHome';
import NewTicketScreen from '../components/ServiceTickets/NewTicket';
import ScheduleMaintenanceScreen from '../components/ServiceTickets/ScheduleMaintenance';
import OtherTicketScreen from '../components/ServiceTickets/OtherTickets';
import ServiceTicketListScreen from '../components/ServiceTickets/ServiceTicketsList';

const AppStack = createStackNavigator(
    {
        Home: HomeContentScreen,
        // ChangePasswordScreen: ChangePasswordScreen,
        // UserAccount: UserAccountScreen,
        // EditUserProfile: EditUserProfileScreen,
        SetupNativeAuth: SetupNativeAuthScreen,
        NativeAuthEntry: NativeAuthEntryScreen,
        TaskListScreen: TaskListScreen,
        TaskDetailScreen: TaskDetailScreen,
        LocationMap: LocationMap,
        LocationA: LocationA,
        UpdateMileageHome: UpdateMileageHome,
        ServiceTicketHome: ServiceTicketHome,
        ContactPersonHome: ContactPersonHome,
        DocumentsHome: DocumentsHome,
        GasFilUpHome: GasFilUpHome,
        NewTicketScreen: NewTicketScreen,
        ScheduleMaintenanceScreen: ScheduleMaintenanceScreen,
        OtherTicketScreen: OtherTicketScreen,
        ServiceTicketListScreen: ServiceTicketListScreen,
    }, {
        initialRouteName: 'Home',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#0d7aaa',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#FFFFFF',
                fontSize: 18,
            },
        },
    }
);


const SettingsStack = createStackNavigator({
    UserAccount: UserAccountScreen,
    ChangePasswordScreen: ChangePasswordScreen,
    EditUserProfile: EditUserProfileScreen,
  });


const TasksStack = createStackNavigator({
    TaskListScreen: TaskListScreen,
    TaskDetailScreen: TaskDetailScreen,
    LocationMap: LocationMap,
    LocationA: LocationA,
});

const ServiceStack = createStackNavigator({
  ServiceTicketHome: ServiceTicketHome,
  NewTicketScreen: NewTicketScreen,
  ScheduleMaintenanceScreen: ScheduleMaintenanceScreen,
  OtherTicketScreen: OtherTicketScreen,
  ServiceTicketListScreen: ServiceTicketListScreen,
});
const ContactPersonStack = createStackNavigator({
  ContactPersonHome: ContactPersonHome,
});


  class IconWithBadge extends React.Component {
    render() {
      const { name, badgeCount, color, size } = this.props;
      return (
        <View style={{ width: 24, height: 24, margin: 5, backgroundColor: color }}>
          <Image source={serviceImg} style={{ width: 50, height: 50 }} />
          {/* <Ionicons name={name} size={size} color={color} /> */}
          {badgeCount > 0 && (
            <View
              style={{
                // /If you're using react-native < 0.57 overflow outside of the parent
                // will not work on Android, see https://git.io/fhLJ8
                position: 'absolute',
                right: -6,
                top: -3,
                backgroundColor: 'red',
                borderRadius: 6,
                width: 12,
                height: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {badgeCount}
              </Text>
            </View>
          )}
        </View>
      );
    }
  }

  const HomeIconWithBadge = (props) => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    return <IconWithBadge {...props} badgeCount={3} />;
  };

  const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let IconComponent = Ionicons;
    let iconName;
    if (routeName === 'Home') {
      iconName = `md-home${focused ? '' : ''}`;
      // We want to add badges to home tab icon
      // IconComponent = HomeIconWithBadge;
    } else if (routeName === 'Settings') {
      iconName = `ios-options${focused ? '' : '-outline'}`;
    } else if (routeName === 'Tasks') {
      iconName = `tasks${focused ? '' : ''}`;
      IconComponent = FontAwesome;
    } else if (routeName === 'Services') {
      iconName = `screwdriver`;
      IconComponent = MaterialCommunityIcons;
    } else if (routeName === 'ContactPerson') {
      iconName = `contact-phone${focused ? '' : ''}`;
      IconComponent = MaterialIcons;
    }

    // You can return any component that you like here!
    return <IconComponent name={iconName} size={25} color={tintColor} />;
  };

const TabStack = createBottomTabNavigator(
    {
      Home: AppStack,
      Tasks: TasksStack,
      Services: ServiceStack,
      ContactPerson: ContactPersonStack,
      Settings: SettingsStack,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, tintColor }) =>
            getTabBarIcon(navigation, focused, tintColor),
        }),
        tabBarOptions: {
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        },
      }
  );
export default TabStack;
