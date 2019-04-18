import React from 'react';
import { Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import strings from '../utils/localization';

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
import ExpenseReportInputScreen from '../components/ExpenseReports/ExpenseReportInput';

const AppStack = createStackNavigator(
    {
        Home: HomeContentScreen,
        AssetCheckinScreen: AssetCheckinScreen,
        // ChangePasswordScreen: ChangePasswordScreen,
        // UserAccount: UserAccountScreen,
        // EditUserProfile: EditUserProfileScreen,
        SetupNativeAuth: SetupNativeAuthScreen,
        NativeAuthEntry: NativeAuthEntryScreen,
        // TaskListScreen: TaskListScreen,
        // TaskDetailScreen: TaskDetailScreen,
        LocationMap: LocationMap,
        LocationA: LocationA,
        UpdateMileageHome: UpdateMileageHome,
        // ServiceTicketHome: ServiceTicketHome,
        // ContactPersonHome: ContactPersonHome,
        DocumentsHome: DocumentsHome,
        GasFilUpHome: GasFilUpHome,
        // NewTicketScreen: NewTicketScreen,
        // ScheduleMaintenanceScreen: ScheduleMaintenanceScreen,
        // OtherTicketScreen: OtherTicketScreen,
        // ServiceTicketListScreen: ServiceTicketListScreen,
        // MechanicProfile: MechanicProfile,
        PdfViewScreen: PdfViewScreen,
        ImageViewScreen: ImageViewScreen,
        ExpenseReportHomeScreen: ExpenseReportHomeScreen,
        UploadDocsHomeScreen: UploadDocsHomeScreen,
        AnimatedMarkers: AnimatedMarkers,
        ExpenseReportInput: ExpenseReportInputScreen,
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
    LanguageSelectionScreen: LanguageSelectionScreen,
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
  render() {
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 28, height: 26 }} source={contactMechanic} />
    </View>
  );
}
}
class ServiceIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render() {
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 33, height: 25 }} source={serviceImg} />
    </View>
  );
}
}
class TaskIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render() {
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 19, height: 27 }} source={taskImg} />
    </View>
  );
}
}
class HomeIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render() {
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 28, height: 25 }} source={homeImg} />
    </View>
  );
}
}
class SettingIcon extends React.PureComponent {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  render() {
  const { opacity } = this.props;
  return (
    <View style={{ opacity: opacity }}>
        <Image style={{ width: 24, height: 26 }} source={settingImg} />
    </View>
  );
}
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

export class GetTabBarLabel extends React.PureComponent {
  render() {
    const { navigation, focused, appLanguage, languageDetails } = this.props;
    const { routeName } = navigation.state;
    const bundle = languageDetails.bundle || {};
    // console.log('app language', appLanguage, 'bundle', bundle);
    const string = bundle ? bundle[appLanguage] : {};
    // console.log('string', string);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: focused ? 1 : 0.3 }}>
      <Text style={{ fontSize: 10, color: 'black', fontFamily: 'Montserrat-SemiBold' }}>{`${string ? string[routeName]: routeName}`}</Text>
    </View>
  );
  }
}


// const getTabBarLabel = (props) => {
//   const { navigation, focused, appLanguage } = props;
//   const { routeName } = navigation.state;
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: focused ? 1 : 0.3 }}>
//       <Text style={{ fontSize: 12 }}>{`${routeName}`}</Text>
//     </View>
//   );
// };

function mapStateToProps(state) {
  let { auth, commonReducer } = state;
  let { userDetails } = commonReducer || {};

  let languageDetails = commonReducer.languageDetails || {};
  let appLanguage = commonReducer.appLanguage || 'en';
  // console.log('language details', languageDetails, 'app ', appLanguage);
  let { token, isLoading } = auth.userStatus;
  let { decodedToken, time, isCheckInAsset } = auth || {};
  return {
      auth,
      token,
      isLoading,
      decodedToken,
      userDetails,
      isCheckInAsset,
      time,
      appLanguage,
      languageDetails,
  };
}

GetTabBarLabel = connect(mapStateToProps)(GetTabBarLabel);

// getTabBarLabel = connect(mapStateToProps)(getTabBarLabel);



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
          tabBarLabel: ({ focused, tintColor }) =>
            <GetTabBarLabel
            navigation={navigation} focused={focused}
            />,
            // getTabBarLabel(navigation, focused, tintColor),
        }),
        // defaultNavigationOptions: ({ navigation }) => ({
        //   tabBarLabel: ({ focused, tintColor }) =>
        //     getTabBarLabel(navigation, focused, tintColor),
        // }),
        tabBarOptions: {
          activeTintColor: '#434242',
          inactiveTintColor: 'gray',
          style: {
            paddingTop: 8,
            paddingBottom: 0,
            height: 62,
            backgroundColor: '#fff',
          },
          labelStyle: {
            paddingTop: 4,
          },
        },
      }
  );
export default TabStack;
