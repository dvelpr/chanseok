/* Offline WebGL depth portrait. A tessellated relief, not a full head scan. */
(() => {
  const canvas = document.getElementById('faceCanvas');
  const fallback = document.getElementById('portraitFallback');
  const section = document.querySelector('.portrait-scroll');
  const slider = document.getElementById('rotation');
  const toggle = document.getElementById('motionToggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, target = paused ? 0 : -28, angle = target, renderer, frame = 0;
  const updateToggle = () => {toggle.textContent = paused ? 'Resume motion' : 'Pause motion';toggle.setAttribute('aria-pressed', String(paused));};
  updateToggle();
  function draw() {
    frame = 0;
    angle += (target-angle) * .14;
    if (Math.abs(target-angle)<.025) angle=target;
    document.getElementById('angleValue').textContent = `${Math.round(angle)}°`;
    if(renderer) renderer(angle * Math.PI / 180);
    else fallback.style.transform = `perspective(850px) rotateY(${angle}deg)`;
    if(angle!==target) frame=requestAnimationFrame(draw);
  }
  function requestDraw(){if(!frame)frame=requestAnimationFrame(draw);}
  function scroll(){
    const max=document.documentElement.scrollHeight-innerHeight;
    document.querySelector('.reading-progress').style.width=`${max>0?scrollY/max*100:0}%`;
    if(!paused){const distance=Math.max(1,section.offsetHeight-document.querySelector('.hero').offsetHeight);const progress=Math.max(0,Math.min(1,-section.getBoundingClientRect().top/distance));target=-28+56*progress;slider.value=target;requestDraw();}
  }
  slider.addEventListener('input',()=>{paused=true;updateToggle();target=Number(slider.value);requestDraw();});
  toggle.addEventListener('click',()=>{paused=!paused;updateToggle();if(!paused)scroll();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;updateToggle();if(paused){target=0;slider.value=0;requestDraw();}else scroll();});
  addEventListener('scroll',scroll,{passive:true});addEventListener('resize',()=>{scroll();requestDraw();});
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  function fail(){renderer=null;canvas.style.display='none';fallback.style.display='block';requestDraw();}
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});
  if(gl){
    try {
      const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
      const program=gl.createProgram();
      gl.attachShader(program,shader(gl.VERTEX_SHADER,`attribute vec3 aPosition;attribute vec2 aUv;uniform float yaw;uniform float aspect;uniform float imageAspect;varying vec2 vUv;void main(){vec3 p=aPosition;float c=cos(yaw),s=sin(yaw);vec3 r=vec3(p.x*c+p.z*s,p.y,-p.x*s+p.z*c);float perspective=3.6/(3.6-r.z);float fit=min(0.88,0.88*aspect/imageAspect);gl_Position=vec4(r.x*imageAspect/aspect*fit*perspective,r.y*fit*perspective,0.,1.);vUv=aUv;}`));
      gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision mediump float;uniform sampler2D portrait;varying vec2 vUv;void main(){vec4 color=texture2D(portrait,vUv);if(color.a<0.03)discard;gl_FragColor=color;}`));
      gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Portrait shader link failed');gl.useProgram(program);
      const vertices=[],uv=[],indices=[],n=100;
      for(let row=0;row<=n;row++)for(let col=0;col<=n;col++){
        const x=col/n*2-1,y=1-row/n*2;
        const ellipsoid=Math.sqrt(Math.max(0,1-(x/.65)**2-(y/.96)**2))*.38;
        const nose=.19*Math.exp(-((x/.12)**2)-((y+.12)/.23)**2);
        const cheeks=.055*(Math.exp(-(((x-.27)/.19)**2)-((y+.18)/.25)**2)+Math.exp(-(((x+.27)/.19)**2)-((y+.18)/.25)**2));
        vertices.push(x,y,ellipsoid+nose+cheeks-.2);uv.push(col/n,row/n);
        if(row<n&&col<n){let i=row*(n+1)+col;indices.push(i,i+n+1,i+1,i+1,i+n+1,i+n+2);}
      }
      const attribute=(name,data,size)=>{gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);};
      attribute('aPosition',vertices,3);attribute('aUv',uv,2);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
      const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      const image=new Image();image.onload=()=>{
        try{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        const yaw=gl.getUniformLocation(program,'yaw'),aspect=gl.getUniformLocation(program,'aspect');gl.uniform1f(gl.getUniformLocation(program,'imageAspect'),image.width/image.height);
        renderer=value=>{const dpr=Math.min(devicePixelRatio||1,2);const w=Math.round(canvas.clientWidth*dpr),h=Math.round(canvas.clientHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(yaw,value);gl.uniform1f(aspect,w/h);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);};
        canvas.style.display='block';fallback.style.display='none';requestDraw();}catch{fail();}
      };image.onerror=fail;image.src=window.portraitTexture;
    }catch{fail();}
  }
  scroll();requestDraw();
})();
