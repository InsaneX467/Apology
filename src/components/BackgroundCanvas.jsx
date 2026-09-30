import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle types: 'heart', 'sparkle', 'petal'
    const particleCount = 35;
    const particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 12 + 8; // 8px to 20px
        this.speedY = -(Math.random() * 0.8 + 0.3); // Slow upward float
        this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.35 + 0.15; // Subtle background opacity
        this.type = Math.random() > 0.3 ? 'heart' : Math.random() > 0.5 ? 'sparkle' : 'petal';
        this.color = ['#ff758f', '#ffb6c1', '#d8b4fe', '#ffccd5'][Math.floor(Math.random() * 4)];
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
        this.rotation += this.rotSpeed;

        if (this.y < -30 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'heart') {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          const topCurveHeight = this.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          // Top left curve
          ctx.bezierCurveTo(-this.size / 2, -topCurveHeight, -this.size, topCurveHeight, 0, this.size);
          // Top right curve
          ctx.bezierCurveTo(this.size, topCurveHeight, this.size / 2, -topCurveHeight, 0, topCurveHeight);
          ctx.closePath();
          ctx.fill();
        } else if (this.type === 'sparkle') {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size * 0.6, Math.sin((i * Math.PI) / 2) * this.size * 0.6);
            ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.2, Math.sin((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.2);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Petal / oval
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.7, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}
