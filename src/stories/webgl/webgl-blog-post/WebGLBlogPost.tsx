import React from 'react';

const POST_URL = 'https://drmayor.blogspot.com/2018/05/10-raytracing.html';

//ToDo is it rendering ?
//create WebGl Folder dude
const WebGLBlogPost: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      overflow: 'hidden',
    }}
  >
    <iframe
      src={POST_URL}
      title="WebGL — Ray Tracing (drmayor.blogspot.com)"
      style={{
        flex: 1,
        width: '100%',
        border: 'none',
        display: 'block',
      }}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  </div>
);

export default WebGLBlogPost;
