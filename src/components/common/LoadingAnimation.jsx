const LoadingAnimation = ({ size = 40, color = "#3A426F" }) => (
  <svg 
    xmlns='http://www.w3.org/2000/svg' 
    viewBox='0 0 200 200'
    width={size}
    height={size}
  >
    <circle fill={color} stroke={color} strokeWidth='15' r='15' cx='40' cy='65'>
      <animate 
        attributeName='cy' 
        calcMode='spline' 
        dur='2' 
        values='65;135;65;' 
        keySplines='.5 0 .5 1;.5 0 .5 1' 
        repeatCount='indefinite' 
        begin='-.4'
      />
    </circle>
    <circle fill={color} stroke={color} strokeWidth='15' r='15' cx='100' cy='65'>
      <animate 
        attributeName='cy' 
        calcMode='spline' 
        dur='2' 
        values='65;135;65;' 
        keySplines='.5 0 .5 1;.5 0 .5 1' 
        repeatCount='indefinite' 
        begin='-.2'
      />
    </circle>
    <circle fill={color} stroke={color} strokeWidth='15' r='15' cx='160' cy='65'>
      <animate 
        attributeName='cy' 
        calcMode='spline' 
        dur='2' 
        values='65;135;65;' 
        keySplines='.5 0 .5 1;.5 0 .5 1' 
        repeatCount='indefinite' 
        begin='0'
      />
    </circle>
  </svg>
);

export default LoadingAnimation;