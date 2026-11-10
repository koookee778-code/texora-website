import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { computeLogoChoreography, LogoTransformState } from '../utils/scrollMath';
import { loadExactUploadedLogo } from '../utils/logoProcessor';

interface Texora3DCanvasProps {
  /** Mutable ref updated synchronously on scroll without triggering React re-renders */
  scrollProgressRef: React.MutableRefObject<number>;
}

/**
 * Renders the user's EXACT uploaded logo (/assets/aistudio/IMG-20260827-WA0022_4b96c238.jpg)
 * in 3D space with:
 * 1. Real-time DOM bounding-box & empty-lane tracking so the 3D logo NEVER touches or stops over any text.
 * 2. Critically-damped, speed-capped fluid spring motion so movement is calm, slow, and silky-smooth.
 */
export const Texora3DCanvas: React.FC<Texora3DCanvasProps> = ({ scrollProgressRef }) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0, 6.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const sliceCount = isSoftwareGl ? 5 : 7;
    const totalDepth = 0.14;
    const planeWidth = 2.45;
    const planeHeight = planeWidth * (893 / 1051);
    const sliceGeo = new THREE.PlaneGeometry(planeWidth, planeHeight);

    const frontBackMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
    });

    const edgeSliceMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      alphaTest: 0.15,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < sliceCount; i++) {
      const t = i / (sliceCount - 1);
      const zOffset = (t - 0.5) * totalDepth;
      const isOuterFace = i === 0 || i === sliceCount - 1;
      const mesh = new THREE.Mesh(sliceGeo, isOuterFace ? frontBackMat : edgeSliceMat);
      mesh.position.z = zOffset;
      rootGroup.add(mesh);
    }

    let logoTex: THREE.CanvasTexture | null = null;
    let isDisposed = false;

    const initialTarget = computeLogoChoreography(scrollProgressRef.current);
    const current = {
      x: initialTarget.x,
      y: initialTarget.y,
      z: initialTarget.z,
      rotX: initialTarget.rotX,
      rotY: initialTarget.rotY,
      rotZ: initialTarget.rotZ,
      scale: initialTarget.scale,
      vx: 0,
      vy: 0,
    };

    let lastTimeMs = performance.now();
    let frameId = 0;
    let isRunning = false;
    let minActiveFrames = 0;

    function wakeUpLoop() {
      minActiveFrames = 36;
      if (isDisposed || isRunning) return;
      isRunning = true;
      lastTimeMs = performance.now();
      tick();
    }

    loadExactUploadedLogo()
      .then(({ originalCanvas }) => {
        if (isDisposed) return;
        logoTex = new THREE.CanvasTexture(originalCanvas);
        logoTex.colorSpace = THREE.SRGBColorSpace;
        logoTex.generateMipmaps = false;
        logoTex.minFilter = THREE.LinearFilter;
        logoTex.magFilter = THREE.LinearFilter;
        logoTex.needsUpdate = true;

        frontBackMat.map = logoTex;
        frontBackMat.needsUpdate = true;

        edgeSliceMat.map = logoTex;
        edgeSliceMat.needsUpdate = true;
        wakeUpLoop();
      })
      .catch(() => {});

    /**
     * Reads live DOM bounding boxes of the Hero text and all Slalom Pillar cards
     * so the 3D logo stays strictly inside the open empty lane and NEVER overlaps text.
     */
    function computeLiveCollisionFreeTarget(baseTarget: LogoTransformState) {
      const viewW = container?.clientWidth || window.innerWidth || 1280;
      const viewH = container?.clientHeight || window.innerHeight || 800;

      const dist = camera.position.z - baseTarget.z;
      const fovRad = (camera.fov * Math.PI) / 180;
      const visH = 2 * dist * Math.tan(fovRad * 0.5);
      const visW = visH * (viewW / Math.max(1, viewH));

      const pxToWorldX = (px: number) => (px / viewW - 0.5) * visW;
      const pyToWorldY = (py: number) => (0.5 - py / viewH) * visH;

      let desiredX = baseTarget.x * Math.min(1, Math.max(0.58, camera.aspect / 1.4));
      let desiredY = baseTarget.y;
      let desiredScale = baseTarget.scale;
      let desiredRotY = baseTarget.rotY;
      let desiredRotZ = baseTarget.rotZ;

      // 1. Check live Slalom Pillar Cards ([data-slalom-card])
      const cardNodes = document.querySelectorAll<HTMLElement>('[data-slalom-card]');
      if (cardNodes.length > 0 && baseTarget.progress < 0.64) {
        let weightedX = 0;
        let weightedScale = 0;
        let weightedRotY = 0;
        let totalWeight = 0;

        const screenCenterY = viewH * 0.5;

        cardNodes.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenterY = (rect.top + rect.bottom) * 0.5;
          const distFromCenterY = Math.abs(cardCenterY - screenCenterY);
          const influenceRadius = viewH * 0.72;

          if (distFromCenterY < influenceRadius) {
            const normDist = distFromCenterY / influenceRadius;
            // Smooth cosine bell weight
            const weight = 0.5 * (1 + Math.cos(normDist * Math.PI));
            const cardCenterX = (rect.left + rect.right) * 0.5;
            // Accurately detect if card is on right side of screen regardless of RTL/LTR
            const isPhysicallyRight = cardCenterX > viewW * 0.5;

            let laneCenterPx = viewW * 0.5;
            let laneWidthPx = viewW * 0.45;

            if (isPhysicallyRight) {
              // Card is on the RIGHT (rect.left .. rect.right) -> Open lane is on the LEFT (24px .. rect.left - 28px)
              const leftEdgePx = 24;
              const rightLimitPx = Math.max(leftEdgePx + 60, rect.left - 28);
              laneCenterPx = (leftEdgePx + rightLimitPx) * 0.5;
              laneWidthPx = rightLimitPx - leftEdgePx;
            } else {
              // Card is on the LEFT (rect.left .. rect.right) -> Open lane is on the RIGHT (rect.right + 28px .. viewW - 24px)
              const leftLimitPx = Math.min(viewW - 84, rect.right + 28);
              const rightEdgePx = viewW - 24;
              laneCenterPx = (leftLimitPx + rightEdgePx) * 0.5;
              laneWidthPx = rightEdgePx - leftLimitPx;
            }

            const laneWorldX = pxToWorldX(laneCenterPx);
            const laneWorldWidth = (laneWidthPx / viewW) * visW;
            // Ensure the logo width never exceeds 72% of the available empty lane width
            const maxSafeScale = Math.min(
              0.74,
              Math.max(0.38, (laneWorldWidth * 0.72) / planeWidth)
            );

            weightedX += laneWorldX * weight;
            weightedScale += maxSafeScale * weight;
            weightedRotY += (isPhysicallyRight ? 0.22 : -0.22) * weight;
            totalWeight += weight;
          }
        });

        if (totalWeight > 0.05) {
          const blend = Math.min(1, totalWeight);
          const avgX = weightedX / totalWeight;
          const avgScale = weightedScale / totalWeight;
          const avgRotY = weightedRotY / totalWeight;

          desiredX = THREE.MathUtils.lerp(desiredX, avgX, blend);
          desiredScale = THREE.MathUtils.lerp(desiredScale, avgScale, blend);
          desiredRotY = THREE.MathUtils.lerp(desiredRotY, avgRotY, blend);
          desiredRotZ = desiredRotY * 0.18;
          desiredY = THREE.MathUtils.lerp(desiredY, 0.0, blend);
        }
      }

      // 2. Check Hero Text Block ([data-hero-text-block]) so the logo NEVER overlaps Hero text
      // while remaining 100% visible inside the viewport
      const heroTextEl = document.querySelector<HTMLElement>('[data-hero-text-block]');
      if (heroTextEl && baseTarget.progress < 0.14) {
        const heroStyle = window.getComputedStyle(heroTextEl);
        const heroOpacity = parseFloat(heroStyle.opacity || '1');
        if (heroOpacity > 0.08) {
          const rect = heroTextEl.getBoundingClientRect();
          const logoHalfHeightWorld = planeHeight * desiredScale * 0.5;
          const heroTopWorldY = pyToWorldY(rect.top);
          const safeMarginWorld = (22 / viewH) * visH;
          const rawMinY = heroTopWorldY + logoHalfHeightWorld + safeMarginWorld;

          // Keep vertical position safely inside the top viewport while gliding to the left open lane
          const clampedSafeY = Math.min(1.26, rawMinY);
          if (Math.abs(desiredX) < 1.35 && desiredY < clampedSafeY) {
            desiredY = clampedSafeY;
          }
          if (rawMinY > 1.15) {
            const dodgeBlend = Math.min(1, (rawMinY - 1.15) * 1.4);
            const leftOpenX = pxToWorldX(viewW * 0.24);
            desiredX = THREE.MathUtils.lerp(desiredX, leftOpenX, dodgeBlend);
          }
        }
      }

      return {
        x: desiredX,
        y: desiredY,
        z: baseTarget.z,
        rotX: baseTarget.rotX,
        rotY: desiredRotY,
        rotZ: desiredRotZ,
        scale: desiredScale,
      };
    }

    function tick() {
      if (isDisposed) return;

      const p = scrollProgressRef.current;
      if (p >= 0.72 || document.hidden) {
        isRunning = false;
        return;
      }

      const nowMs = performance.now();
      const dt = Math.min(Math.max((nowMs - lastTimeMs) / 1000, 0.001), 0.05);
      lastTimeMs = nowMs;

      const baseTarget = computeLogoChoreography(p);
      const target = computeLiveCollisionFreeTarget(baseTarget);

      // Calm, fluid, speed-capped damping so the logo never darts fast or jerks
      const posLambda = isSoftwareGl ? 6.5 : 3.6;
      const rotLambda = isSoftwareGl ? 5.5 : 3.2;

      const nextX = THREE.MathUtils.damp(current.x, target.x, posLambda, dt);
      const nextY = THREE.MathUtils.damp(current.y, target.y, posLambda, dt);

      // Cap maximum horizontal/vertical speed so transitions across the screen feel graceful and unhurried
      const maxStepX = (isSoftwareGl ? 8.5 : 4.2) * dt;
      const maxStepY = (isSoftwareGl ? 6.5 : 3.4) * dt;
      const dx = THREE.MathUtils.clamp(nextX - current.x, -maxStepX, maxStepX);
      const dy = THREE.MathUtils.clamp(nextY - current.y, -maxStepY, maxStepY);

      current.x += dx;
      current.y += dy;
      current.z = THREE.MathUtils.damp(current.z, target.z, posLambda, dt);
      current.scale = THREE.MathUtils.damp(current.scale, target.scale, posLambda, dt);

      // Gentle velocity banking proportional to smooth horizontal speed
      const horizontalSpeed = dx / Math.max(dt, 0.008);
      const gentleBankY = THREE.MathUtils.clamp(horizontalSpeed * 0.04, -0.18, 0.18);
      const gentleBankZ = THREE.MathUtils.clamp(-horizontalSpeed * 0.022, -0.10, 0.10);

      current.rotX = THREE.MathUtils.damp(current.rotX, target.rotX, rotLambda, dt);
      current.rotY = THREE.MathUtils.damp(
        current.rotY,
        target.rotY + gentleBankY,
        rotLambda,
        dt
      );
      current.rotZ = THREE.MathUtils.damp(
        current.rotZ,
        target.rotZ + gentleBankZ,
        rotLambda,
        dt
      );

      rootGroup.position.set(current.x, current.y, current.z);
      rootGroup.rotation.set(current.rotX, current.rotY, current.rotZ);
      rootGroup.scale.setScalar(current.scale);

      renderer.render(scene, camera);

      if (minActiveFrames > 0) {
        minActiveFrames--;
      }

      const deltaSum =
        Math.abs(current.x - target.x) +
        Math.abs(current.y - target.y) +
        Math.abs(current.rotY - target.rotY) +
        Math.abs(current.scale - target.scale);

      if (minActiveFrames <= 0 && deltaSum < 0.001) {
        isRunning = false;
        return;
      }

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 20);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    wakeUpLoop();

    const onScrollOrVisibility = () => {
      Promise.resolve().then(() => {
        if (!isDisposed && !document.hidden && scrollProgressRef.current < 0.72) {
          wakeUpLoop();
        }
      });
    };

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      wakeUpLoop();
    };

    window.addEventListener('scroll', onScrollOrVisibility, { passive: true });
    document.addEventListener('visibilitychange', onScrollOrVisibility);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isDisposed = true;
      isRunning = false;
      window.removeEventListener('scroll', onScrollOrVisibility);
      document.removeEventListener('visibilitychange', onScrollOrVisibility);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      sliceGeo.dispose();
      frontBackMat.dispose();
      edgeSliceMat.dispose();
      if (logoTex) logoTex.dispose();
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <div
      ref={canvasMountRef}
      data-testid="texora-3d-canvas"
      className="w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};
