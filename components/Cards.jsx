import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { getContrastYIQ } from './utils/colors.js';

// const useStyles = makeStyles(() => ({
//     card: {
//         borderRadius: '10px',
//         transition: '0.3s',
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         background: '#ffffff',
//     },
//     pill: {
//         borderRadius: '7px',
//         transition: '0.3s',
//         width: '100%',
//         overflow: 'hidden',
//         background: '#ffffff',
//     },
//     cardheader: {
//     },
//     content: {
//         paddingTop: '1%',
//         display: 'flex',
//         flexWrap: 'wrap',
//         textAlign: 'left',
//         overflowX: 'auto',
//         '& table': {
//             marginBottom: 0,
//         }
//     },
// }));

const HeaderCard = ({ children, color = 'secondary', sx }) => {
    const theme = useTheme();
    let heading = '';
    let subheading = '';
    if (children && Object.keys(children).length === 0 && children.constructor === Object) { children = '' } else {
        if (Array.isArray(children)) { // multiple lines
            if (children[0].type.name === 'h1') {
                heading = children[0].props.children;
                children = children.filter(function(obj, index) {
                    return index !== 0; // return false for index 1
                  });
                if (children[0].type.name === 'h2') {
                    subheading = children[0].props.children;
                    children = children.filter(function(obj, index) {
                        return index !== 0; // return false for index 1
                      });
                };
            };
        } 
    };
    // console.log('HeaderCard:children : ', children)
    return (
        <Grid item xs={3} sx={{ paddingLeft: '10px', paddingRight: '10px', overFlow: 'hidden', maxHeight: '100%' }}>
            <Card variant="outlined" sx={{ 
               borderRadius: '10px',
               transition: '0.3s',
               width: '100%',
               height: '100%',
               overflow: 'hidden',
               background: '#ffffff',
              ...sx }}>
                {heading && <CardHeader
                    title={heading}
                    titleTypographyProps={{ color: getContrastYIQ(theme.palette.background[color], theme), fontSize: '1.8rem' }}
                    subheader={subheading}
                    subheaderTypographyProps={{ color: getContrastYIQ(theme.palette.background[color], theme), fontSize: '1.6rem' }}
                    sx={{ fontSize: '2rem', backgroundColor: 'background.' + color, color: getContrastYIQ(theme.palette.background[color], theme) }} />}
                <CardContent sx={{
                  paddingTop: '1%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  textAlign: 'left',
                  overflowX: 'auto',
                  '& table': {
                      marginBottom: 0,
                  },
                  '& h1': {
                    fontSize: '1.8rem',
                }
                }}>
                    {children && children}
                </CardContent>
            </Card>
        </Grid>
    );
};

const Nest = ({ children, color = 'secondary', width=3, level=0, sx }) => {
    const theme = useTheme();
    let heading = '';
    let subheading = '';
    let bgColor = 'paper'
    if (level > 0) {width = width *2} //double the width 
    if (width > 12) {width = 12} // to a maximum of full width
    if (children && Object.keys(children).length === 0 && children.constructor === Object) { children = '' } else {
        if (Array.isArray(children)) { // multiple lines
            if (children[0].type.name === 'h1') {
                heading = children[0].props.children;
                children = children.filter(function(obj, index) {
                    return index !== 0; // return false for index 1
                  });
                if (children[0].type.name === 'h2') {
                    subheading = children[0].props.children;
                    children = children.filter(function(obj, index) {
                        return index !== 0; // return false for index 1
                      });
                };
            };
        } else { //only a single element, lets make it the header
            bgColor = color;
        }
    };
    // console.log('HeaderCard:children : ', children)
    return (
        <Grid item xs={width} sx={{ paddingLeft: '10px', paddingRight: '10px', overFlow: 'hidden', maxHeight: '100%', ...sx }}>
            <Card variant="outlined" sx={{ 
              borderRadius: '7px',
              transition: '0.3s',
              width: '100%',
              overflow: 'hidden',
              background: '#ffffff',
              ...sx }}>
                {heading && <CardHeader
                    title={heading}
                    titleTypographyProps={{ color: getContrastYIQ(theme.palette.background[color], theme), fontSize: '1rem' }}
                    subheader={subheading}
                    subheaderTypographyProps={{ color: getContrastYIQ(theme.palette.background[color], theme), fontSize: '0.8rem' }}
                    sx={{ backgroundColor: 'background.' + color, color: getContrastYIQ(theme.palette.background[color], theme) }} />}
                <CardContent sx={{
                   paddingTop: '1%',
                   display: 'flex',
                   flexWrap: 'wrap',
                   textAlign: 'left',
                   overflowX: 'auto',
                   '& table': {
                       marginBottom: 0,
                   },
                  fontSize: '0.8rem', backgroundColor: 'background.' + bgColor, color: getContrastYIQ(theme.palette.background[bgColor], theme)}}>
                    {children && <Wrapper color={color} level={level+1} width={width} sx={{mt:'5px'}}>{children}</Wrapper>}
                </CardContent>
            </Card>
        </Grid>
    );
};

function Wrapper({children, ...props}) {
    // console.log('Wrapper : ', children)
    return (
      <>
        {React.Children.map(children, child => {
          // Only add props to MDX elements
          if (typeof child === 'object') {
            return React.cloneElement(child, props);
          }
          return child;
        })}
     </>
    );
  }


export { HeaderCard, Nest }