import React from 'react';
import { Text, View, Image } from 'react-native';
// import serviceImg from '../assets/images/serviceImg.png';
import contactMechanic from '../assets/images/bottom-tab/contact-mechnic.png';
import serviceImg from '../assets/images/bottom-tab/service-ticket.png';
import taskImg from '../assets/images/bottom-tab/tasks.png';
import homeImg from '../assets/images/bottom-tab/home.png';
import settingImg from '../assets/images/bottom-tab/setting.png';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

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
import MechanicProfile from '../components/ContactPerson/MechanicProfile';
import AssetCheckinScreen from '../components/AssetCheckinScreen';
import LanguageSelectionScreen from '../components/LanguageSupportScreen/LanguageList';
import PdfViewScreen from '../components/DocumentsView/PdfView';
import ImageViewScreen from '../components/DocumentsView/ImageView';
import ExpenseReportHomeScreen from '../components/ExpenseReports/ExpenseReportHome';
import UploadDocsHomeScreen from '../components/UploadDocs/UploadDocsHome';
import AnimatedMarkers from '../components/MapView/LiveLocationTracking';

const AppStack = createStackNavigator(
    {
        Home: HomeContentScreen,
        AssetCheckinScreen: AssetCheckinScreen,
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
        MechanicProfile: MechanicProfile,
        LanguageSelectionScreen: LanguageSelectionScreen,
        PdfViewScreen: PdfViewScreen,
        ImageViewScreen: ImageViewScreen,
        ExpenseReportHomeScreen: ExpenseReportHomeScreen,
        UploadDocsHomeScreen: UploadDocsHomeScreen,
        AnimatedMarkers: AnimatedMarkers,
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
  MechanicProfile: MechanicProfile,
});


class ContactIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render(){
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width:30, height: 28 }} source={contactMechanic} />
    </View>
  )
};
}
class ServiceIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render(){
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 33, height: 25 }} source={serviceImg} />
    </View>
  )
};
}
class TaskIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render(){
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 19, height: 27 }} source={taskImg} />
    </View>
  )
};
}
class HomeIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render(){
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 28, height: 25 }} source={homeImg} />
    </View>
  )
};
}
class SettingIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render(){
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 24, height: 26 }} source={settingImg} />
    </View>
  )
};
}
  class IconWithBadge extends React.Component {
    render() {
      const { name, badgeCount, color, size, opacity } = this.props;
      return (
        <View style={{ opacity: opacity }}>
          <Image source={contactMechanic} />
          {/* <Ionicons name={name} size={size} color={color} /> */}
          {/* {badgeCount > 0 && (
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
          )} */}
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
    let opacity = 1;
    if (routeName === 'HOME') {
      iconName = `home${focused ? '' : ''}`;
      opacity = focused ? 1 : 0.3;
      // We want to add badges to home tab icon
      IconComponent = HomeIcon;
    } else if (routeName === 'SETTINGS') {
      iconName = `ios-options${focused ? '' : '-outline'}`;
      opacity = focused ? 1 : 0.3;
      IconComponent = SettingIcon;
    } else if (routeName === 'TASKS') {
      iconName = `tasks${focused ? '' : ''}`;
      opacity = focused ? 1 : 0.3;
      IconComponent = TaskIcon;
    } else if (routeName === 'SERVICES') {
      iconName = `screwdriver`;
      opacity = focused ? 1 : 0.3;
      IconComponent = ServiceIcon;
    } else if (routeName === 'CONTACT') {
      iconName = `contact-phone${focused ? '' : ''}`;
      opacity = focused ? 1 : 0.3;
      IconComponent = ContactIcon;
    }

    // You can return any component that you like here!
    return <IconComponent style={{ }} opacity={opacity} name={iconName} size={25} color={tintColor} />;
  };

const TabStack = createBottomTabNavigator(
    {
      HOME: AppStack,
      TASKS: TasksStack,
      SERVICES: ServiceStack,
      CONTACT: ContactPersonStack,
      SETTINGS: SettingsStack,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, tintColor }) =>
            getTabBarIcon(navigation, focused, tintColor),
        }),
        tabBarOptions: {
          activeTintColor: '#434242',
          inactiveTintColor: 'gray',
          style: {
            paddingTop: 8,
            paddingBottom: 5,
            height: 60,
          },
          labelStyle: {
            paddingTop: 4,
          },
        },
      }
  );
export default TabStack;
