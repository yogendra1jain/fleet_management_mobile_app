import { StyleSheet } from 'react-native';

export default theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    // resizeMode: 'cover',
  },
  backFullImg: {
    flex: 1,
    resizeMode: 'contain', // or 'cover'
    width: null,
    alignSelf: 'stretch',
    padding: 0,
    margin: 0,
  },
  containerModalWithoutFlex: {
    // flex: 2,
    height: 200,
    backgroundColor: '#ffffff',
  },
  containerModalWithFlex: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerAlign: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    paddingTop: 20,
    backgroundColor: '#336699',
  },
  padT15: {
    paddingTop: 15,
  },
  padB15: {
    paddingBottom: 15,
  },
  padL15: {
    paddingLeft: 15,
  },
  padR15: {
    paddingRight: 15,
  },
  mart15: {
    marginTop: 15,
  },
  marB15: {
    marginBottom: 15,
  },
  marL15: {
    marginLeft: 15,
  },
  marR15: {
    marginRight: 15,
  },
  padT10: {
    paddingTop: 10,
  },
  padB10: {
    paddingBottom: 10,
  },
  padL10: {
    paddingLeft: 10,
  },
  padR10: {
    paddingRight: 10,
  },
  mart10: {
    marginTop: 10,
  },
  mart25: {
    marginTop: 25,
  },
  marR25: {
    marginRight: 25,
  },
  marL25: {
    marginLeft: 25,
  },
  marB10: {
    marginBottom: 10,
  },
  marL10: {
    marginLeft: 10,
  },
  marR10: {
    marginRight: 10,
  },
  plrb15: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 25,
  },
  mlrtb15: {
    margin: 15,
  },
  textgray: {
    color: '#000000',
    fontSize: 13,
  },

  textblack: {
    color: '#4e4e4e',
    fontSize: 13,
  },
  textgreen: {
    color: 'green',
    fontSize: 12,
  },
  patientDataLabel: {
    justifyContent: 'flex-start',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#373737',
  },
  patientData: {
    justifyContent: 'flex-start',
    fontSize: 11,
    fontWeight: 'normal',
    color: '#4e4e4e',
  },
  bggraysereen: {
    backgroundColor: '#ededed',
  },
  bgwhitesereen: {
    backgroundColor: '#ffffff',
  },
  vialsblock: {
    marginLeft: 10,
    marginBottom: 15,
    marginRight: 10,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  itemsblock: {
    marginLeft: 15,
    // marginBottom: 15,
    marginRight: 15,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  headingStyle1: {
    fontSize: 15,
    fontWeight: 'normal',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },

  headerContainer: {
    height: 80,
    backgroundColor: '#0d7aaa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  timerStyle:
    { fontSize: 11, fontWeight: 'normal', padding: 10, paddingTop: 15, paddingBottom: 15 },

  headerHeading: {
    display: 'flex',
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    padding: 15,
    paddingBottom: 0,
  },
  containerContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },

  header: {
    padding: 10,
    backgroundColor: '#08388e',
  },

  buttonText: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 40,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    justifyContent: 'center',
  },

  Iconmob: { position: 'absolute', top: 40 },
  Iconkeypad: { position: 'absolute', top: 44 },

  buttonNormal: {
    height: 45,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    minWidth: 100,
  },
  buttonBordered: {
    borderWidth: 1,
    borderColor: '#00A9E0',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnclr1: {
    backgroundColor: '#2c1cc4',
  },
  cardShape: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  buttonLogin: {
    height: 45,
    backgroundColor: '#156FEA',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    minWidth: 100,
  },
  buttonAlignBottom: {
    height: 40,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 10,
    minWidth: 100,
  },
  buttonAlignBottom1: {
    height: 25,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    // marginLeft: 10,
    marginTop: 5,
    // paddingLeft: 3,
    // paddingRight: 3,
  },
  buttonAlignBottomCancel: {
    height: 30,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 0,
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonDisable: {
    height: 45,
    backgroundColor: '#d4d4d4',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    minWidth: 100,
  },
  fwidth: {
    flex: 1,
  },

  buttonSmall: {
    backgroundColor: 'transparent',
    height: 35,
    borderColor: '#00A9E0',
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    width: 80,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonSmallList: {
    backgroundColor: 'transparent',
    height: 35,
    borderColor: '#00A9E0',
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: 70,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonMdmList: {
    backgroundColor: 'transparent',
    height: 35,
    borderColor: '#00A9E0',
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: 100,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonWithoutBorderMdmList: {
    backgroundColor: 'transparent',
    height: 35,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: 100,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonSmallTxtB: {
    color: '#00A9E0',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 11,
    flex: 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonSmallTxt: {
    color: '#ffffff',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 11,
  },

  txtalignRight: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },

  input: {
    height: 40,
    borderRadius: 0,
    fontSize: 14,
  },

  buttonFix: {
    height: 45,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flex: 1,
  },
  butttonFixTxt: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  butttonFixTxtCancel: {
    color: '#fff',
    fontSize: 11,
  },


  title: {
    fontSize: 15,
    alignSelf: 'center',
    marginBottom: 30,
    backgroundColor: '#374046',
  },

  formStyle: {
    flex: 1,
  },

  branding: {
    flex: 1,
    alignItems: 'flex-start',

  },

  notification: {
    paddingLeft: 10,
    paddingRight: 10,

  },


  headerWrapper: {
    flexDirection: 'row',
    display: 'flex',
    padding: 10,

  },
  addMoneyWrapper:
  {
    borderWidth: 0,
    padding: 10,
    paddingTop: 0,
  },

  vbWrapper: {
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: '#0882b7',
    padding: 15,


  },
  tmWrapper:
  {
    flexDirection: 'row',
    display: 'flex',
  },

  wBalance:
  {
    flexDirection: 'column',
    flex: 1,
  },

  txtStyle1:
  {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 0,
  },

  txtStyle2:
  {
    color: '#ffffff',
    fontSize: 40,
    lineHeight: 45,

  },

  listName:
  {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 0,
    color: '#000000',
  },
  listDate:
  {
    fontSize: 13,
    paddingBottom: 5,
    color: '#404040',
  },

  listDesc:
  {
    color: '#686868',
    fontSize: 11,
  },

  Statustxt:
  {
    color: '#333333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  Pending:
  {
    color: '#ffc704',
    fontSize: 11,
  },

  Progress:
  {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 11,
    color: '#00d3ec',
  },

  Failed:
  {
    color: '#ff0000',
    fontSize: 11,
  },

  FailedDot:
  {
    backgroundColor: '#ff0000',
    width: 5,
    height: 5,
    borderRadius: 50,
  },
  orderAmount:
  {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: 'bold',
    paddingBottom: 5,
  },

  patientDetaillist1: {
    width: 70,
  },

  patientDetaillist: {
    flex: 1,
  },

  patientDetaillistA: {
    paddingRight: 30,
  },

  textbold: {
    fontWeight: 'bold',
  },

  alignLeft: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  alignRight: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  alignBadgeRight: {
    justifyContent: 'flex-end',
  },

  directionRow: {
    flexDirection: 'row',
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 8,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 2,
    paddingTop: 15,
  },
  bgWhite: {
    backgroundColor: '#ffffff',
  },
  patientlisttext1: {
    color: '#000000',
    fontSize: 14,
  },

  patientlisttext: {
    color: '#000000',
    fontSize: 14,
    paddingBottom: 5,
  },
  ssn: {
    color: '#404040',
    fontSize: 12,
    paddingBottom: 3,
  },

  patientDetailview:
    { flex: 1, paddingLeft: 10 },

  screenHeadingtxt: {
    fontSize: 15,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    // borderBottomWidth: 1,
    // borderBottomColor: '#bbb',
    flex: 1,
    textAlign: 'center',
  },
  screenHeadingtxt1: {
    fontSize: 15,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    textAlign: 'center',
  },
  screenHeadingtxt2: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#00A9E0',
    marginBottom: 10,
    textAlign: 'left',
    color: '#000000',
  },
  screenHeadingtxtMP: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 5,
    // borderBottomWidth: 2,
    // borderBottomColor: '#00A9E0',
    marginBottom: 0,
    textAlign: 'left',
    color: '#000000',
  },
  qrBlock: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  QRwrapper: {
    flex: 1,
    marginTop: 25,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captopleft: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  captopright: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  capbottomright: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  capbottomleft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  spaceAdd1: {
    flex: 1,
    height: 45,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  printButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5,
    // marginBottom: 10,
    // marginTop: 10,
  },
  spaceAdd2: {
    flex: 1,
    height: 45,
    backgroundColor: '#00A9E0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  spaceAdd2Disable: {
    flex: 1,
    height: 45,
    backgroundColor: '#d4d4d4',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },

  headingstyle2: {
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#00A9E0',
  },
  headingstyleMP: {
    paddingTop: 3,
    paddingBottom: 3,
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00A9E0',
  },
  headingstyle4: {
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 3,
    borderBottomColor: '#00A9E0',
  },
  headingstyle3: {
    paddingBottom: 6,
    flexDirection: 'row',
    marginBottom: 6,
    borderBottomColor: '#d4d4d4',
    borderBottomWidth: 1,
  },
  headingstylePromoHeader: {
    paddingBottom: 6,
    flexDirection: 'row',
    // marginBottom: 6,
    paddingTop: 6,
    marginTop: 6,
  },
  headingstyletxt2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headingstyleonlytxt2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headingstyletxt3: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
