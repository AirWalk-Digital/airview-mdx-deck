import { MDXRemote } from 'next-mdx-remote'
import { useState, useEffect, } from 'react';
import { mdComponents } from "../../../components/MDXProvider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../../../constants/theme';
import { useRouter } from 'next/router'
// import SlidePage from '../../../layouts/SlidePage'

function Wrap(pad) {
  console.log('Wrap:pad: ', pad)
  const scope = { frontmatter: {title: 'test', image: 'test-image.png'}}
  console.log('Wrap:scope: ', pad.pad.source.frontmatter)
  if (pad.pad.format === 'SlidePage') {
    return (
      // <MDXRemote {...pad.pad.source} components={mdComponents} scope={scope}/>
      <MDXRemote {...pad.pad.source} components={mdComponents} />
    )
  } else if (pad.pad.format === 'PrintSlide') {
    return (<MDXRemote {...pad.pad.source} components={mdComponents} />)

  } else {
      return (<MDXRemote {...pad.pad.source} components={mdComponents} />)
  }
}


export default function Pad() {
  const router = useRouter()
  const { id, format } = router.query
  const [pad, setPad] = useState();
  const [rev, setRev] = useState(0);
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    fetch(`/api/etherpad/pad-revs?pad=${id}`)
    .then((res) => res.json())
    .then(data => {
      // console.log('data.rev : ', data.rev , 'rev : ', rev)
      if (data.rev && data.rev > rev) {
        console.log('new revision :', data.rev)
        const newrev = data.rev
        fetch(`/api/etherpad/fetch-pad?pad=${id}&format=${format}&rev=${newrev}`)
        .then((res) => res.json())
        .then(data => {
            if (data.source && !data.error) { 
              console.log(data)

              setPad(data)
              setRev(newrev);
            };
            // setRev(newrev);

        })
        .catch(error => {
          console.log(error)
        })        
      }
      
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });

  }, [refreshToken]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        {pad && <Wrap pad={pad} /> }
    </ThemeProvider>
  )
}