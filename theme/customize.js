import t from 'tcomb-form-native';
import select from './customSelect';
import textbox from './customForm';
import datepicker from './customDatePicker';
// import i18n from 'tcomb-form-native/lib/i18n/en';
// import templates from 'tcomb-form-native/lib/templates/bootstrap';

export default () => {
    console.log('-------------------------Inside Customize function----------------------------------');
    const stylesheet = t.form.Form.stylesheet;
    // overriding the text color
    stylesheet.textbox.error.fontFamily = 'Montserrat-Regular';
    stylesheet.textbox.error.fontSize = 14;
    stylesheet.errorBlock.fontSize = 14;
    stylesheet.errorBlock.marginTop = 5;
    stylesheet.controlLabel.error.fontSize =15;
    stylesheet.controlLabel.error.fontWeight = 'normal';
    stylesheet.controlLabel.normal.fontFamily = 'Montserrat-Regular';
    stylesheet.controlLabel.normal.fontSize = 15;
    stylesheet.controlLabel.normal.marginBottom =2;
    stylesheet.controlLabel.normal.color = '#7c7c7c';
    stylesheet.controlLabel.normal.fontWeight = 'normal';
    stylesheet.textbox.normal.fontFamily = 'Montserrat-Regular';
    stylesheet.textbox.normal.borderWidth = 0;
    stylesheet.textbox.error.borderWidth = 0;
    stylesheet.textbox.normal.marginBottom = 0;
    stylesheet.textbox.error.marginBottom = 0;
    stylesheet.textboxView.normal.borderWidth = 0;
    stylesheet.textboxView.error.borderWidth = 0;
    stylesheet.textboxView.normal.borderRadius = 0;
    stylesheet.textboxView.error.borderRadius = 0;
    stylesheet.textboxView.normal.borderBottomWidth = 1;
    stylesheet.textboxView.normal.borderBottomColor ='#7c7c7c';
    stylesheet.textboxView.error.borderBottomWidth = 1;
    stylesheet.textbox.normal.marginBottom = 0;
    stylesheet.textbox.error.marginBottom = 0;
    stylesheet.textbox.normal.fontSize = 14;
    stylesheet.textbox.normal.height =30;
    stylesheet.textbox.error.height =30;
    stylesheet.select.borderBottomWidth = 1;

    const templates = t.form.Form.templates;
    templates.select = select;
    templates.textbox = textbox;
    templates.datepicker = datepicker;
    console.log('Templates. ', templates);
};

