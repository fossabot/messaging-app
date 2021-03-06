import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { fade } from 'material-ui/utils/colorManipulator';
import {
    blue,
    blue50,
    blue100,
    blue200,
    blue300,
    blue500,
    blue900,
    pinkA200,
    grey50,
    grey100,
    grey200,
    grey300,
    grey500,
    grey700,
    grey900,
    white,
    darkBlack,
    fullBlack,
} from 'material-ui/styles/colors';

export default getMuiTheme({
    palette: {
        negative: pinkA200,
        blue50: blue50,
        primary1Color: '#1D8BF1',
        primary2Color: blue100,
        primary3Color: blue300,
        accent1Color: grey50,
        accent2Color: grey100,
        accent3Color: grey300,
        accent4Color: grey500,
        darkGray: grey700,
        superDarkGray: grey900,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
});
