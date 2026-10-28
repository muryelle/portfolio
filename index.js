  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme;
  }

  let heroLibrariesPromise;
  let heroInitialized = false;
  const loadScript = source => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  const ensureHeroScene = () => {
    if (heroInitialized) return;
    heroLibrariesPromise ||= loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'));
    heroLibrariesPromise.then(() => {
      if (!heroInitialized) {
        initializeHero();
        heroInitialized = true;
      }
    }).catch(() => {});
  };

  const links = document.querySelectorAll('[data-target]');
  const navLinks = document.querySelectorAll('#mainNav [data-target]');
  const views = document.querySelectorAll('section.view');
  links.forEach(link=>{
    link.addEventListener('click', event=>{
      event.preventDefault();
      navLinks.forEach(navLink=>navLink.classList.remove('active'));
      const activeNavLink = Array.from(navLinks).find(navLink => navLink.dataset.target === link.dataset.target);
      activeNavLink?.classList.add('active');
      views.forEach(v=>v.classList.remove('active'));
      document.getElementById(link.dataset.target).classList.add('active');
      if (link.dataset.target === 'home') ensureHeroScene();
      document.getElementById('mainNav').classList.remove('open');
      const projectId = link.dataset.project;
      const projectTarget = projectId && document.getElementById(projectId);
      if (projectTarget) {
        projectTarget.scrollIntoView({top:0,behavior:'smooth', block:'start'});
      } else {
        window.scrollTo({top:0,behavior:'smooth'});
      }
    });
  });
  document.getElementById('menuToggle').addEventListener('click', ()=>{
    document.getElementById('mainNav').classList.toggle('open');
  });
  document.getElementById('theme-toggle').addEventListener('click', ()=>{
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('portfolio-theme', html.dataset.theme);
  });
  document.getElementById('contactForm').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = 'Demande de contact depuis le portfolio';
    const body = [
      `Nom : ${formData.get('name')}`,
      `Email : ${formData.get('email')}`,
      '',
      formData.get('message')
    ].join('\n');
    window.location.href = `mailto:murielle.houngan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  document.querySelector('.scroll-hint').addEventListener('click', ()=>{
    document.querySelector('#about-work').scrollIntoView({behavior:'smooth', block:'start'});
  });

  document.querySelectorAll('.project-filters').forEach(filterGroup => {
    const projectContainers = filterGroup.parentElement.querySelectorAll('.project-showcase-grid, .grid-projects');
    if (!projectContainers.length) return;
    const projects = Array.from(projectContainers).flatMap(container => Array.from(container.querySelectorAll('[data-category]')));
    filterGroup.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        filterGroup.querySelectorAll('button').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        const selectedFilter = button.dataset.filter;
        projects.forEach(project => {
          const categories = project.dataset.category.trim().split(/\s+/);
          project.hidden = selectedFilter !== 'all' && !categories.includes(selectedFilter);
        });
      });
    });
  });

  const cptvSlideshow = document.querySelector('.cptv-slideshow');
  const cptvImage = cptvSlideshow?.querySelector('img');
  if (cptvSlideshow && cptvImage) {
    const cptvImages = [
      'assets/cptv/1.webp',
      'assets/cptv/2.webp',
      'assets/cptv/3.webp',
      'assets/cptv/4.webp',
      'assets/cptv/5.webp',
      'assets/cptv/6.webp',
      'assets/cptv/7.webp'
    ];
    let cptvImageIndex = 0;
    const showCptvImage = () => {
      cptvImage.src = cptvImages[cptvImageIndex];
      cptvImage.alt = `Cartographie participative des terroirs villageois, image ${cptvImageIndex + 1} sur 7`;
    };
    let cptvTimer = setInterval(() => {
      cptvImageIndex = (cptvImageIndex + 1) % cptvImages.length;
      showCptvImage();
    }, 3000);
    const restartCptvTimer = () => {
      clearInterval(cptvTimer);
      cptvTimer = setInterval(() => {
        cptvImageIndex = (cptvImageIndex + 1) % cptvImages.length;
        showCptvImage();
      }, 3000);
    };
    cptvSlideshow.querySelector('.cptv-previous').addEventListener('click', () => {
      cptvImageIndex = (cptvImageIndex - 1 + cptvImages.length) % cptvImages.length;
      showCptvImage();
      restartCptvTimer();
    });
    cptvSlideshow.querySelector('.cptv-next').addEventListener('click', () => {
      cptvImageIndex = (cptvImageIndex + 1) % cptvImages.length;
      showCptvImage();
      restartCptvTimer();
    });
  }

  const delineationSlideshow = document.querySelector('.delineation-slideshow');
  const delineationImage = delineationSlideshow?.querySelector('img');
  if (delineationSlideshow && delineationImage) {
    const delineationImages = [
      'assets/TreecrownDelienation.webp'
      // Ajouter ici les prochains visuels de délinéation.
    ];
    let delineationImageIndex = 0;
    const showDelineationImage = () => {
      delineationImage.src = delineationImages[delineationImageIndex];
      delineationImage.alt = `Délinéation des couronnes d’arbres, image ${delineationImageIndex + 1} sur ${delineationImages.length}`;
    };
    let delineationTimer = setInterval(() => {
      delineationImageIndex = (delineationImageIndex + 1) % delineationImages.length;
      showDelineationImage();
    }, 3500);
    const restartDelineationTimer = () => {
      clearInterval(delineationTimer);
      delineationTimer = setInterval(() => {
        delineationImageIndex = (delineationImageIndex + 1) % delineationImages.length;
        showDelineationImage();
      }, 3500);
    };
    delineationSlideshow.querySelector('.delineation-previous').addEventListener('click', () => {
      delineationImageIndex = (delineationImageIndex - 1 + delineationImages.length) % delineationImages.length;
      showDelineationImage();
      restartDelineationTimer();
    });
    delineationSlideshow.querySelector('.delineation-next').addEventListener('click', () => {
      delineationImageIndex = (delineationImageIndex + 1) % delineationImages.length;
      showDelineationImage();
      restartDelineationTimer();
    });
  }

  const formationSlideshow = document.querySelector('.formation-slideshow');
  const formationImage = formationSlideshow?.querySelector('img');
  if (formationSlideshow && formationImage) {
    const formationImages = [
      'assets/formation_img/formation_1.webp',
      'assets/formation_img/formation_2.webp',
      'assets/formation_img/formation_3.webp',
      'assets/formation_img/formation_4.webp',
      'assets/formation_img/formation_5.webp',
      'assets/formation_img/formation_6.webp',
      'assets/formation_img/formation_7.webp',
      'assets/formation_img/formation_8.webp',
      'assets/formation_img/formation_9.webp',
      'assets/formation_img/formation_10.webp'
    ];
    let formationImageIndex = 0;
    const showFormationImage = () => {
      formationImage.src = formationImages[formationImageIndex];
      formationImage.alt = `Formatrice SIG et Géomatique, image ${formationImageIndex + 1} sur ${formationImages.length}`;
    };
    let formationTimer = setInterval(() => {
      formationImageIndex = (formationImageIndex + 1) % formationImages.length;
      showFormationImage();
    }, 3000);
    const restartFormationTimer = () => {
      clearInterval(formationTimer);
      formationTimer = setInterval(() => {
        formationImageIndex = (formationImageIndex + 1) % formationImages.length;
        showFormationImage();
      }, 3000);
    };
    formationSlideshow.querySelector('.formation-previous').addEventListener('click', () => {
      formationImageIndex = (formationImageIndex - 1 + formationImages.length) % formationImages.length;
      showFormationImage();
      restartFormationTimer();
    });
    formationSlideshow.querySelector('.formation-next').addEventListener('click', () => {
      formationImageIndex = (formationImageIndex + 1) % formationImages.length;
      showFormationImage();
      restartFormationTimer();
    });
  }

  const terrainSlideshow = document.querySelector('.terrain-slideshow');
  const terrainImage = terrainSlideshow?.querySelector('img');
  if (terrainSlideshow && terrainImage) {
    const terrainImages = [
      'assets/terrain_img/20180318_125658.webp',
      'assets/terrain_img/IMG_20220620_143346_237.webp',
      'assets/terrain_img/IMG_20220622_172112_642.webp',
      'assets/terrain_img/IMG_20250114_114231.webp',
      'assets/terrain_img/IMG_20250212_112556.webp',
      'assets/terrain_img/IMG_20250303_122729.webp',
      'assets/terrain_img/IMG_20250303_123333.webp',
      'assets/terrain_img/IMG_20190201_114843.webp'
    ];
    let terrainImageIndex = terrainImages.indexOf(terrainImage.getAttribute('src'));
    terrainImageIndex = terrainImageIndex < 0 ? 0 : terrainImageIndex;
    const showTerrainImage = () => {
      terrainImage.src = terrainImages[terrainImageIndex];
      terrainImage.alt = `Acquisition terrain, image ${terrainImageIndex + 1} sur ${terrainImages.length}`;
    };
    const moveTerrainImage = (offset) => {
      terrainImageIndex = (terrainImageIndex + offset + terrainImages.length) % terrainImages.length;
      showTerrainImage();
    };
    let terrainTimer = setInterval(() => moveTerrainImage(1), 3000);
    const restartTerrainTimer = () => {
      clearInterval(terrainTimer);
      terrainTimer = setInterval(() => moveTerrainImage(1), 3000);
    };
    terrainSlideshow.querySelector('.terrain-previous').addEventListener('click', () => {
      moveTerrainImage(-1);
      restartTerrainTimer();
    });
    terrainSlideshow.querySelector('.terrain-next').addEventListener('click', () => {
      moveTerrainImage(1);
      restartTerrainTimer();
    });
  }

  const coordinateLayer = document.querySelector('.hero-coordinate-layer');
  if (coordinateLayer) {
    const baseLatitude = 48.1173;
    const baseLongitude = 1.6778;
    setInterval(() => {
      const coordinate = document.createElement('span');
      const lat = baseLatitude + (Math.random() - 0.5) * 0.0015;
      const lon = baseLongitude + (Math.random() - 0.5) * 0.0015;
      coordinate.className = 'video-coordinate';
      coordinate.textContent = `${lat.toFixed(4)}° N  ${lon.toFixed(4)}° W`;
      coordinate.style.left = `${58 + Math.random() * 30}%`;
      coordinate.style.top = `${22 + Math.random() * 56}%`;
      if (coordinateLayer.children.length >= 5) {
        coordinateLayer.firstElementChild.remove();
      }
      coordinateLayer.appendChild(coordinate);
      coordinate.addEventListener('animationend', () => coordinate.remove());
    }, 800);
  }

  const initializeHero = () => {
  const heroCanvas = document.getElementById('hero3d-canvas');
  const heroScene = document.querySelector('.hero-scene');
  if (heroCanvas && heroScene && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.1, 6.2);
    const renderer = new THREE.WebGLRenderer({canvas: heroCanvas, antialias: true, alpha: true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0x334466, 0.9));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(-3, 2, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x3d7bff, 0.5);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const globe = new THREE.Group();
    globe.position.set(1.45, 0, 0);
    globe.rotation.z = -0.2;
    scene.add(globe);

    const earthTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earthNormal = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 48, 32),
      new THREE.MeshStandardMaterial({map:earthTexture, bumpMap:earthNormal, bumpScale:.04, roughness:.85, metalness:.05})
    );
    globe.add(earth);
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.58, 32, 24),
      new THREE.MeshBasicMaterial({color:0x4d9fff, wireframe:true, transparent:true, opacity:.18})
    ));

    const points = [];
    for (let index = 0; index < 180; index += 1) {
      const latitude = Math.acos(2 * Math.random() - 1);
      const longitude = Math.random() * Math.PI * 2;
      points.push(1.62 * Math.sin(latitude) * Math.cos(longitude), 1.62 * Math.cos(latitude), 1.62 * Math.sin(latitude) * Math.sin(longitude));
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const dataPoints = new THREE.Points(pointGeometry, new THREE.PointsMaterial({color:0xffb703, size:.035, transparent:true, opacity:.9}));
    globe.add(dataPoints);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.12, .009, 8, 96),
      new THREE.MeshBasicMaterial({color:0x4d9fff, transparent:true, opacity:.25})
    );
    orbit.rotation.x = Math.PI / 2.5;
    globe.add(orbit);

    const satellites = [];
    const addSatellite = (radius, speed, tilt, size) => {
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.z = tilt;
      const satellite = new THREE.Group();
      satellite.add(new THREE.Mesh(new THREE.BoxGeometry(size, size * .6, size * .6), new THREE.MeshStandardMaterial({color:0xdfe6ee, metalness:.6, roughness:.3})));
      const panelMaterial = new THREE.MeshStandardMaterial({color:0x1c5a8a, metalness:.4, roughness:.4, side:THREE.DoubleSide});
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(size * 2.2, size * .8), panelMaterial);
      panel.position.x = size * 1.7;
      const oppositePanel = panel.clone();
      oppositePanel.position.x = -size * 1.7;
      satellite.add(panel, oppositePanel);
      orbitGroup.add(satellite);
      globe.add(orbitGroup);
      satellites.push({orbitGroup, satellite, angle:Math.random() * Math.PI * 2, speed, radius});
      const orbitLine = new THREE.Mesh(new THREE.TorusGeometry(radius, .004, 8, 100), new THREE.MeshBasicMaterial({color:0x4d9fff, transparent:true, opacity:.25}));
      orbitLine.rotation.x = Math.PI / 2;
      orbitGroup.add(orbitLine);
    };
    addSatellite(2.3, .45, .3, .09);
    addSatellite(2.7, -.3, -.5, .07);
    addSatellite(3.1, .22, 1.1, .08);

    const starPositions = [];
    for (let index = 0; index < 450; index += 1) {
      starPositions.push((Math.random() - .5) * 40, (Math.random() - .5) * 25, (Math.random() - .5) * 40 - 5);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({color:0xffffff, size:.05, transparent:true, opacity:.7}));
    scene.add(stars);

    const resizeHero = () => {
      const width = heroScene.clientWidth;
      const height = heroScene.clientHeight;
      camera.aspect = width / height;
      camera.position.z = width < 700 ? 7.2 : 6.2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resizeHero();
    window.addEventListener('resize', resizeHero);

    const controls = typeof THREE.OrbitControls !== 'undefined' ? new THREE.OrbitControls(camera, heroCanvas) : null;
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = .06;
      controls.enablePan = false;
      controls.minDistance = 3.5;
      controls.maxDistance = 12;
      controls.autoRotate = false;
    }

    let elapsed = 0;
    let userInteracting = false;
    heroCanvas.addEventListener('pointerdown', () => { userInteracting = true; });
    window.addEventListener('pointerup', () => { userInteracting = false; });
    const animateHero = () => {
      requestAnimationFrame(animateHero);
      elapsed += .01;
      if (!userInteracting) globe.rotation.y += .0016;
      dataPoints.material.opacity = .6 + Math.sin(elapsed * 3) * .3;
      satellites.forEach(({orbitGroup, satellite, speed, radius}) => {
        orbitGroup.userData.angle = (orbitGroup.userData.angle || Math.random() * Math.PI * 2) + speed * .01;
        satellite.position.set(Math.cos(orbitGroup.userData.angle) * radius, 0, Math.sin(orbitGroup.userData.angle) * radius);
        satellite.lookAt(globe.position);
      });
      stars.rotation.y = elapsed * .008;
      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    animateHero();
  }
  };
  if (document.getElementById('home')?.classList.contains('active')) ensureHeroScene();

  const travelLightbox = document.querySelector('.travel-lightbox');
  if (travelLightbox) {
    const travelLightboxViewport = travelLightbox.querySelector('.travel-lightbox-viewport');
    const travelLightboxImage = travelLightboxViewport.querySelector('img');
    const travelLightboxCaption = travelLightbox.querySelector('p');
    const travelZoomLevel = travelLightbox.querySelector('.travel-lightbox-zoom-level');
    const travelZoomOut = travelLightbox.querySelector('.travel-lightbox-zoom-out');
    const travelZoomIn = travelLightbox.querySelector('.travel-lightbox-zoom-in');
    const travelPhotos = Array.from(document.querySelectorAll('.travel-photo'));
    const certificatePhotos = Array.from(document.querySelectorAll('.certificate-preview'));
    let activeLightboxPhotos = travelPhotos;
    let activeTravelPhotoIndex = 0;
    let travelZoom = 1;
    let fittedTravelImageWidth = 0;
    const updateTravelZoomControls = () => {
      travelZoomLevel.textContent = `${Math.round(travelZoom * 100)}%`;
      travelZoomOut.disabled = travelZoom <= 1;
      travelZoomIn.disabled = travelZoom >= 4;
    };
    const fitTravelImage = () => {
      if (!travelLightboxImage.naturalWidth) return;
      const fitScale = Math.min(
        travelLightboxViewport.clientWidth / travelLightboxImage.naturalWidth,
        travelLightboxViewport.clientHeight / travelLightboxImage.naturalHeight
      );
      fittedTravelImageWidth = travelLightboxImage.naturalWidth * fitScale;
      travelZoom = 1;
      travelLightboxImage.style.width = `${fittedTravelImageWidth}px`;
      travelLightboxViewport.scrollTo(0, 0);
      updateTravelZoomControls();
    };
    const setTravelZoom = nextZoom => {
      const previousWidth = fittedTravelImageWidth * travelZoom;
      const centerX = (travelLightboxViewport.scrollLeft + travelLightboxViewport.clientWidth / 2) / previousWidth;
      const centerY = (travelLightboxViewport.scrollTop + travelLightboxViewport.clientHeight / 2) / (previousWidth * travelLightboxImage.naturalHeight / travelLightboxImage.naturalWidth);
      travelZoom = Math.min(4, Math.max(1, nextZoom));
      const nextWidth = fittedTravelImageWidth * travelZoom;
      travelLightboxImage.style.width = `${nextWidth}px`;
      updateTravelZoomControls();
      requestAnimationFrame(() => {
        travelLightboxViewport.scrollTo(
          nextWidth * centerX - travelLightboxViewport.clientWidth / 2,
          nextWidth * travelLightboxImage.naturalHeight / travelLightboxImage.naturalWidth * centerY - travelLightboxViewport.clientHeight / 2
        );
      });
    };
    const closeTravelLightbox = () => travelLightbox.close();
    const showTravelPhoto = index => {
      activeTravelPhotoIndex = (index + activeLightboxPhotos.length) % activeLightboxPhotos.length;
      const photo = activeLightboxPhotos[activeTravelPhotoIndex];
      travelZoom = 1;
      fittedTravelImageWidth = 0;
      travelLightboxImage.style.width = '';
      travelLightboxViewport.scrollTo(0, 0);
      travelLightboxImage.src = photo.dataset.full;
      travelLightboxImage.alt = photo.querySelector('img').alt;
      travelLightboxCaption.textContent = photo.dataset.caption || '';
      travelLightbox.classList.toggle('no-caption', !photo.dataset.caption);
      if (travelLightboxImage.complete) fitTravelImage();
    };
    travelLightboxImage.addEventListener('load', fitTravelImage);
    travelZoomOut.addEventListener('click', () => setTravelZoom(travelZoom - 0.5));
    travelZoomIn.addEventListener('click', () => setTravelZoom(travelZoom + 0.5));
    travelLightbox.querySelector('.travel-lightbox-zoom-reset').addEventListener('click', fitTravelImage);
    travelPhotos.forEach((photo, index) => {
      photo.addEventListener('click', () => {
        activeLightboxPhotos = travelPhotos;
        showTravelPhoto(index);
        travelLightbox.showModal();
      });
    });
    certificatePhotos.forEach((photo, index) => {
      photo.addEventListener('click', () => {
        activeLightboxPhotos = certificatePhotos;
        showTravelPhoto(index);
        travelLightbox.showModal();
      });
    });
    travelLightbox.querySelector('.travel-lightbox-close').addEventListener('click', closeTravelLightbox);
    travelLightbox.querySelector('.travel-lightbox-previous').addEventListener('click', () => showTravelPhoto(activeTravelPhotoIndex - 1));
    travelLightbox.querySelector('.travel-lightbox-next').addEventListener('click', () => showTravelPhoto(activeTravelPhotoIndex + 1));
    travelLightbox.addEventListener('cancel', event => {
      closeTravelLightbox();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && travelLightbox.open) closeTravelLightbox();
      if (!travelLightbox.open) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showTravelPhoto(activeTravelPhotoIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showTravelPhoto(activeTravelPhotoIndex + 1);
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setTravelZoom(travelZoom + 0.5);
      }
      if (event.key === '-') {
        event.preventDefault();
        setTravelZoom(travelZoom - 0.5);
      }
      if (event.key === '0') fitTravelImage();
    });
    travelLightbox.addEventListener('click', event => {
      if (event.target === travelLightbox) closeTravelLightbox();
    });
  }
