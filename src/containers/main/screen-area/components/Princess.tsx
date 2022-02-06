import {
  defineComponent,
  computed,
} from 'vue';
import './Princess.css';


const Princess = defineComponent((props) => {

  return () => (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='100'
      height='100'
      viewBox='0 0 100 100'
    >
      <g>
        <ellipse
          class={'Princess-main'}
          id='path4800'
          cx='49.999508'
          cy='13.234289'
          rx='12.593534'
          ry='12.593532'
        />
        <path
          style='fill:#1a1a1a;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1'
          d='m 40.47547,98.996255 c -1.59873,-2.567658 12.311288,-5.312406 12.311288,-5.312406 l 4.890786,-1.433508 -0.168648,7.58915 -8.854009,0.168649 c 0,0 -7.374273,0.28123 -8.179417,-1.011885 z'
          id='path4915'
        />
        <path
          class={'Princess-main'}
          d='m 56.328361,51.943519 -1.0906,17.876313 c 2.087028,4.629689 0.852782,12.580653 0.924088,19.226065 l 1.347047,2.6985 -14.335062,4.722139 c 0,0 6.128426,-3.018227 7.420503,-5.902673 1.829945,-4.085186 -0.758915,-13.407499 -0.758915,-13.407499 l -4.131871,-25.55014 z'
          id='path5205'
        />
        <path
          class={'Princess-main'}
          d='m 41.824652,24.285282 15.684244,0.168647 0.84324,28.332829 -14.335342,0.02566 c 0,0 -1.175932,-0.224085 -1.348903,-0.700252 -0.457363,-1.259062 1.238666,-2.405435 1.546763,-3.709082 0.30046,-1.271336 0.707982,-2.67883 0.270435,-3.909734 C 41.6386,36.485628 37.357098,26.095824 41.824652,24.285282 Z'
          id='path5430'
        />
        <rect
          class={'Princess-main'}
          id='rect5454'
          width='14.841005'
          height='36.427921'
          x='57.340248'
          y='20.743679'
          ry='8.4323912'
          rx='7.4205027'
        />
        <path
          style='fill:#090007;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1'
          id='path13123'
          d='M 38.832907,19.574411 A 11.299402,10.962107 0 0 1 38.478152,7.959914 l 9.755117,5.531909 z'
        />
        <path
          style='fill:#f2f90b;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1'
          d='m 46.180335,16.248084 -0.08944,-7.0954933 1.997471,1.9080323 1.580089,-1.8782193 1.49065,1.7291543 2.116723,-1.8185933 -0.05963,7.2445583 z'
          id='path13582'
        />
      </g>
    </svg>
  );
});

export default Princess;
