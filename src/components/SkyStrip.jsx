/**
 * SkyStrip - the cloudy sky: the site's ONLY background, plus the footer control.
 *
 * ONE shader, TWO canvases (via the createSky() factory below):
 *   1. The BACKGROUND layer: always on behind the whole site. It sleeps in a
 *      soft desaturated gray; when the weather goes live it eases into the
 *      real blue sky (the uSat uniform drives that gray-to-color blend).
 *   2. The footer STRIP: the switch. Gray by default; press and hold ~2.5s and
 *      color spreads out from your fingertip (a circular reveal computed
 *      INSIDE the shader). Hold again while live and it dims from the edges.
 *
 * The clouds are not images - every pixel is computed each frame from layered
 * noise (fbm = several octaves of value noise stacked up). The extra ideas here:
 *   - a low-frequency "mask" clusters cloudiness into big cumulus masses
 *   - sampling density slightly HIGHER up (nup) fakes sun lighting: if there is
 *     less cloud above a pixel, light reaches it → brighter top edges
 *   - a per-frame hash adds live film grain so it feels shot, not generated
 */
import { useEffect, useRef, useState } from "react";

/* vertex shader: one oversized triangle covers the viewport, so the fragment
   shader below runs once per pixel with no geometry to manage */
const VS = "attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.,1.);}";

const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;uniform float uT;uniform vec2 uRes;uniform vec3 uRev;uniform float uSat;
// uRev = the reveal circle: (center x, center y, radius) in canvas pixels.
// The hold interaction only ever changes these three numbers.

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
// 6 octaves here (vs 5 in the silk) - clouds want a bit more fine detail
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p*=2.04;a*=.54;}return v;}

void main(){
vec2 uv=vUv;float as=uRes.x/uRes.y;
// sky gradient: pale near the horizon (bottom) -> deep blue up top
vec3 sky=mix(vec3(0.66,0.83,0.94),vec3(0.28,0.57,0.85),pow(uv.y,0.9));

float t=uT*0.010;                                  // very slow weather clock
vec2 p=vec2(uv.x*as,uv.y*1.15)+vec2(t*0.35,-t*0.7); // wind: drift sideways + rise

// warp field (same trick as the silk) so cloud edges curl instead of banding
vec2 w=vec2(fbm(p*1.1+t*0.3),fbm(p*1.1+vec2(5.2,1.3)-t*0.25));

// LOW-frequency mask decides WHERE clouds cluster (big masses vs clear sky)
float mask=smoothstep(0.30,0.72,fbm(p*0.55+w*0.35));
// HIGH-frequency noise is the cloud material itself
float n=fbm(p*1.9+w*0.85);
// density = material, gated by the mask; smoothstep gives soft billowy edges
float d=smoothstep(0.38,0.78,n)*mix(0.2,1.3,mask);
d=clamp(d,0.0,1.0);

// FAKE SUNLIGHT: sample the same noise a touch higher (y-0.10).
// Less cloud above this pixel -> more light -> brighter. That one line of
// calculus-by-sampling is what makes the tops glow and the bellies shade.
float nup=fbm(p*1.9+w*0.85+vec2(0.0,-0.10));
float light=clamp(0.55+(nup-n)*6.5,0.32,1.12);
vec3 cloud=mix(vec3(0.60,0.70,0.83),vec3(1.04,1.03,1.01),light); // shadow->lit white

vec3 col=mix(sky,cloud,pow(d,0.8));                 // composite clouds over sky
col=mix(col,vec3(0.86,0.93,0.98),0.10*(1.0-uv.y));  // bright haze near horizon

// live film grain: new random speckle pattern ~24x per second
float gn=hash(floor(vUv*uRes)+floor(fract(uT)*24.0)*vec2(13.7,7.3));
col+=(gn-0.5)*0.025;

// THE REVEAL: build a desaturated "sleeping" version of the same pixel,
// then blend vivid/pale by distance to the uRev circle (130px feathered edge).
float lum=dot(col,vec3(0.299,0.587,0.114));         // standard luminance weights
vec3 palec=mix(vec3(lum),col,0.10)*1.02;            // 90% gray, slightly lifted
float m=max(1.0-smoothstep(uRev.z-130.0,uRev.z+10.0,distance(vUv*uRes,uRev.xy)),uSat);
gl_FragColor=vec4(mix(palec,col,m),1.0);}`;

/**
 * createSky(canvas, sizeHost) - builds one independent renderer.
 * Returns { start(revealFn), stop() }. revealFn is asked every frame for the
 * [x, y, radius] of the reveal circle; pass null to render fully vivid.
 * (Standard WebGL setup: compile both shaders, link, one triangle, uniforms.)
 */
function createSky(canvas, sizeHost) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;
  const sh = (t, s) => {
      const o = gl.createShader(t);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS))
        console.error("[webgl] shader compile failed:", gl.getShaderInfoLog(o));
      return o;
    };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  // if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.error("[webgl] program link failed:", gl.getProgramInfoLog(pr)); return null; }
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.error("[webgl] link failed:", gl.getProgramInfoLog(pr)); return null; }
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const lo = gl.getAttribLocation(pr, "aPos");
  gl.enableVertexAttribArray(lo);
  gl.vertexAttribPointer(lo, 2, gl.FLOAT, false, 0, 0);
  const uT = gl.getUniformLocation(pr, "uT");
  const uRes = gl.getUniformLocation(pr, "uRes");
  const uRev = gl.getUniformLocation(pr, "uRev");
  const uSat = gl.getUniformLocation(pr, "uSat");
  let on = false, revFn = null, satFn = null;
  const t0 = performance.now();
  const resize = () => { // half-res render, upscaled by the browser (soft + cheap)
    const w = Math.max(200, ((sizeHost ? sizeHost.clientWidth : window.innerWidth) / 2) | 0);
    const h = Math.max(120, ((sizeHost ? sizeHost.clientHeight : window.innerHeight) / 2) | 0);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }
  };
  const frame = () => {
    if (!on) return;
    resize();
    const rv = revFn ? revFn(canvas) : null;
    if (rv) gl.uniform3f(uRev, rv[0], rv[1], rv[2]);
    else gl.uniform3f(uRev, 0, 0, 0);   // no reveal circle: uSat alone decides color
    gl.uniform1f(uSat, satFn ? satFn() : 0);
    gl.uniform1f(uT, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  };
  let tested = false;
  /* black-frame self-test: some GPU/shield combos silently render black */
  const selfTest = () => {
    if (tested) return;
    tested = true;
    setTimeout(() => {
      try {
        if (!on) return;
        resize();
        gl.uniform3f(uRev, 0, 0, 9e6);
        gl.uniform1f(uSat, 0);
        gl.uniform1f(uT, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const px = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        if (px[0] + px[1] + px[2] === 0) {
          console.error("[webgl] black frame detected, hiding sky canvas");
          canvas.style.display = "none";
          on = false;
        }
      } catch {}
    }, 600);
  };
  return {
    start(f, sf) { revFn = f || null; satFn = sf || null; if (!on) { on = true; requestAnimationFrame(frame); selfTest(); } },
    stop() { on = false; },
  };
}

export default function SkyStrip({ weatherOn, setWeatherOn }) {
  const stripRef = useRef(null);
  const stripCanvas = useRef(null);
  const bgCanvas = useRef(null);
  const bgSky = useRef(null);
  // all hold-gesture state lives in a ref: it changes 60x/sec, so re-rendering
  // React for it would be wasteful - only alive/weatherOn touch React state.
  const hold = useRef({ alive: false, holding: false, r: 0, running: false, last: 0, px: 0, py: 0, needRelease: false });
  const [alive, setAlive] = useState(false);

  /* boot both renderers; the strip's revealFn converts the hold state
     (CSS pixels, y-down) into shader coords (canvas pixels, y-up) */
  useEffect(() => {
    const h = hold.current;
    const strip = createSky(stripCanvas.current, stripRef.current);
    if (strip) strip.start((canvas) => {
      const rect = stripRef.current.getBoundingClientRect();
      if (!rect.width) return [0, 0, 0];
      const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
      return [h.px * sx, (rect.height - h.py) * sy, h.alive ? 9e6 : h.r * sx];
    });
    /* the background is ALWAYS rendering: it sleeps gray and eases into full
       color when the weather goes live (and back when dimmed) */
    bgSky.current = createSky(bgCanvas.current, null);
    let sat = 0;
    bgSky.current?.start(null, () => {
      const target = h.alive ? 1 : 0;
      sat += (target - sat) * 0.015; // slow, cinematic ease between gray and blue
      return sat;
    });
    return () => { strip?.stop(); bgSky.current?.stop(); };
  }, []);

  /* the hold engine: grows/shrinks the reveal radius over time
     hold ~2.5s to fill -> toggles alive; release early -> retreats in 0.9s.
     needRelease forces a finger-lift between toggles so a long press
     can't flip the weather twice in one hold. */
  const maxR = () => {
    const h = hold.current;
    const rect = stripRef.current.getBoundingClientRect();
    return Math.hypot(Math.max(h.px, rect.width - h.px), Math.max(h.py, rect.height - h.py)) + 40;
  };
  const tick = (ts) => {
    const h = hold.current;
    if (!h.last) h.last = ts;
    const dt = Math.min(0.05, (ts - h.last) / 1000);
    h.last = ts;
    const M = maxR();
    const holding = h.holding && !h.needRelease;
    let done = false;
    if (!h.alive) { // sleeping: hold grows color, release shrinks it
      if (holding) { h.r += dt * (M / 2.5); if (h.r >= M) { h.r = M; h.alive = true; h.needRelease = true; setAlive(true); setWeatherOn(true); done = true; } }
      else { h.r -= dt * (M / 0.9); if (h.r <= 0) { h.r = 0; done = true; } }
    } else {       // alive: hold shrinks color (dim), release restores it
      if (holding) { h.r -= dt * (M / 2.5); if (h.r <= 0) { h.r = 0; h.alive = false; h.needRelease = true; setAlive(false); setWeatherOn(false); done = true; } }
      else { h.r += dt * (M / 0.9); if (h.r >= M) { h.r = M; done = true; } }
    }
    if (done) { h.running = false; h.last = 0; return; }
    requestAnimationFrame(tick);
  };
  const down = (e) => {
    const h = hold.current;
    e.preventDefault();
    const rect = stripRef.current.getBoundingClientRect();
    h.px = e.clientX - rect.left; h.py = e.clientY - rect.top;
    if (h.alive) h.r = maxR() * 0.9; // dimming starts visibly, creeping in from the edges
    h.holding = true;
    if (!h.running) { h.running = true; h.last = 0; requestAnimationFrame(tick); }
  };
  const up = () => {
    const h = hold.current;
    h.holding = false; h.needRelease = false;
    if (!h.running) { h.running = true; h.last = 0; requestAnimationFrame(tick); }
  };
  const move = (e) => { // the HOLD TO PLAY/DIM chip follows the cursor like a tooltip
    const cta = stripRef.current?.querySelector("[data-cta]");
    if (!cta) return;
    const rect = stripRef.current.getBoundingClientRect();
    cta.style.left = `${e.clientX - rect.left}px`;
    cta.style.top = `${e.clientY - rect.top}px`;
  };

  return (
    <>
      {/* the site background: always-on clouds, gray while asleep, blue when live */}
      <canvas ref={bgCanvas} aria-hidden
              className={`fixed inset-0 z-0 w-full h-full pointer-events-none blur-[1.5px] saturate-105 transition-opacity duration-[2600ms] ${weatherOn ? "opacity-40" : "opacity-30"}`} />

      <div className="relative z-[1] px-6 pb-10">
        <p className="text-center text-[10.5px] font-semibold tracking-[0.16em] opacity-40 mt-12 mb-3">
          {alive ? "( THE SKY IS LIVE · HOLD AGAIN TO DIM )" : "( PRESS & HOLD THE SKY · BRING IT TO LIFE )"}
        </p>
        {/* the interactive strip; touch-none stops mobile scroll fighting the hold */}
        <div ref={stripRef} onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onPointerMove={move}
             className="group relative h-[clamp(150px,15vw,210px)] rounded-[14px] max-w-[1180px] mx-auto overflow-hidden cursor-pointer select-none touch-none shadow-[0_18px_46px_rgba(20,20,18,0.12)] bg-gradient-to-b from-[#9AA4AB] to-[#C9CFD3]">
          <canvas ref={stripCanvas} className="absolute inset-0 w-full h-full block" />
          <div data-cta
               className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[140%] z-[2] whitespace-nowrap pointer-events-none px-5 py-2.5 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase text-[#243244] backdrop-blur-xl bg-white/50 border border-white/60 shadow-[0_8px_24px_rgba(20,30,40,0.15),inset_0_1px_0_rgba(255,255,255,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            {alive ? "HOLD TO DIM" : "HOLD TO PLAY"}
          </div>
        </div>
      </div>
    </>
  );
}
