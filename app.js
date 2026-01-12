// Global variables for Audio
let droneSynth, melodySynth, melodyLoop, droneSequence;
let currentTrack = 'january2026';
let currentMelodyNotes = [];
let audioInitialized = false;
let trackAdvanceTimerId = null;
let reverb, delay; // Audio Effects

// Global variables for Three.js Visuals
let scene, camera, renderer;
let kaleidoscopeGroup; // Group to hold all kaleidoscope segments
let segmentObjects = []; // Array to hold the core object mesh within each segment
let animationFrameId = null;
// Store current visual parameters
let currentVisParams = {}; 

// DOM Elements
let trackSelect;
let canvasContainer;
let playButton;
let trackControls;
let themeCheckbox;
let mainTitleElement; // Added for main title

// Global theme state
let isDarkMode = true;
// Use Three.js Color objects for background
let bgColorDarkThree = new THREE.Color(0x111111);
let bgColorLightThree = new THREE.Color(0xffffff);
let currentBgColorThree = bgColorDarkThree;

// Track definitions - Using Months as keys
const tracks = {
    january: { // Was track1: Calm, foundational - Blue Icosahedron, 6 segments
        key: 'C', scale: 'major', droneOctave: 2, melodyOctave: 4, melodyLoopInterval: '1m', droneSequencePattern: [0, 4], droneSequenceInterval: '4m', reverbWet: 0.9, melodyProb: 0.6,
        segments: 44, geometryType: 'Icosahedron', materialType: 'MeshPhong', objectColor: 0x6ab0f3, wireframe: true, rotationSpeedX: 0.005, rotationSpeedY: 0.003, groupRotationZ: 0.0005
    },
    february: { // Was track2: Lower, sparser, minor pentatonic - Purple Torus Knot, 8 segments, slower
        key: 'A', scale: 'pentatonicMinor', droneOctave: 2, melodyOctave: 3, melodyLoopInterval: '2m', droneSequencePattern: [0, 3], droneSequenceInterval: '4m', reverbWet: 0.7, melodyProb: 0.5,
        segments: 8, geometryType: 'TorusKnot', materialType: 'MeshPhong', objectColor: 0xab6af3, wireframe: true, rotationSpeedX: 0.002, rotationSpeedY: 0.004, groupRotationZ: 0.0003
    },
    march: { // Was track3: Higher, slightly more active major - Green/Yellow Sphere, 5 segments, faster object rotation
        key: 'G', scale: 'major', droneOctave: 3, melodyOctave: 5, melodyLoopInterval: '1m', droneSequencePattern: [0, 4, 6], droneSequenceInterval: '2m', reverbWet: 0.8, melodyProb: 0.7,
        segments: 15, geometryType: 'Sphere', materialType: 'MeshPhong', objectColor: 0xb8f36a, wireframe: true, rotationSpeedX: 0.0010, rotationSpeedY: 0.008, groupRotationZ: 0.0006
    },
    april: { // Was track4: Mid, Dorian mode, introspective - Cyan Octahedron, 4 segments, wireframe
        key: 'D', scale: 'dorian', droneOctave: 2, melodyOctave: 4, melodyLoopInterval: '2m', droneSequencePattern: [0, 1], droneSequenceInterval: '4m', reverbWet: 0.9, melodyProb: 0.5,
        segments: 24, geometryType: 'Octahedron', materialType: 'MeshPhong', objectColor: 0x6af3e7, wireframe: true, rotationSpeedX: 0.004, rotationSpeedY: 0.004, groupRotationZ: 0.0004
    },
    may: { // Was track5: Floating, Major Pentatonic, high reverb - Pink Dodecahedron, 7 segments, slow group rotation
        key: 'Db', scale: 'pentatonicMajor', droneOctave: 2, melodyOctave: 5, melodyLoopInterval: '1m', droneSequencePattern: [0, 2], droneSequenceInterval: '4m', reverbWet: 0.9, melodyProb: 0.6,
        segments: 47, geometryType: 'Dodecahedron', materialType: 'MeshPhong', objectColor: 0xf36adc, wireframe: true, rotationSpeedX: 0.006, rotationSpeedY: 0.002, groupRotationZ: 0.0001
    },
    june: { // Was track6: Bright, Lydian mode - Orange Tetrahedron, 6 segments, faster group rotation
        key: 'F', scale: 'lydian', droneOctave: 3, melodyOctave: 5, melodyLoopInterval: '1m', droneSequencePattern: [0, 4, 5], droneSequenceInterval: '2m', reverbWet: 0.6, melodyProb: 0.7,
        segments: 36, geometryType: 'Tetrahedron', materialType: 'MeshPhong', objectColor: 0xf3a96a, wireframe: true, rotationSpeedX: 0.007, rotationSpeedY: 0.007, groupRotationZ: 0.0008
    },
    july: { // Was track7: Lower melody, Major, sparse drone - Dark Blue Torus, 8 segments, only X rotation
        key: 'Eb', scale: 'major', droneOctave: 2, melodyOctave: 3, melodyLoopInterval: '2m', droneSequencePattern: [0], droneSequenceInterval: '8m', reverbWet: 0.7, melodyProb: 0.5,
        segments: 8, geometryType: 'Torus', materialType: 'MeshPhong', objectColor: 0x4a6af3, wireframe: true, rotationSpeedX: 0.008, rotationSpeedY: 0.00001, groupRotationZ: 0.0003
    },
    august: { // Was track8: Darker Minor - Red/Purple Icosahedron, 6 segments, basic wireframe
        key: 'B', scale: 'minor', droneOctave: 3, melodyOctave: 4, melodyLoopInterval: '1m', droneSequencePattern: [0, 3, 4], droneSequenceInterval: '2m', reverbWet: 0.8, melodyProb: 0.6,
        segments: 16, geometryType: 'Icosahedron', materialType: 'MeshBasic', objectColor: 0xdc6af3, wireframe: true, rotationSpeedX: 0.0005, rotationSpeedY: 0.0005, groupRotationZ: 0.0005
    },
    september: { // Was track9: Very ambient, high reverb - White/Grey TorusKnot, 9 segments, very slow
        key: 'Ab', scale: 'pentatonicMajor', droneOctave: 3, melodyOctave: 5, melodyLoopInterval: '3m', droneSequencePattern: [0, 4], droneSequenceInterval: '8m', reverbWet: 0.95, melodyProb: 0.4,
        segments: 9, geometryType: 'TorusKnot', materialType: 'MeshStandard', objectColor: 0xeeeeee, wireframe: true, roughness: 0.5, metalness: 0.1, rotationSpeedX: 0.001, rotationSpeedY: 0.001, groupRotationZ: 0.0001
    },
    october: { // Was track10: Exotic, Phrygian mode - Green Torus, 5 segments, faster object rot
        key: 'E', scale: 'phrygian', droneOctave: 2, melodyOctave: 4, melodyLoopInterval: '2m', droneSequencePattern: [0, 1], droneSequenceInterval: '4m', reverbWet: 0.7, melodyProb: 0.5,
        segments: 42, geometryType: 'Torus', materialType: 'MeshPhong', objectColor: 0x6af371, wireframe: true, rotationSpeedX: 0.0012, rotationSpeedY: 0.003, groupRotationZ: 0.0004
    },
    november: { // Was track11: Simple Mixolydian - Yellow Sphere, 6 segments, normal material
        key: 'C', scale: 'mixolydian', droneOctave: 3, melodyOctave: 4, melodyLoopInterval: '1m', droneSequencePattern: [0, 4], droneSequenceInterval: '2m', reverbWet: 0.9, melodyProb: 0.7,
        segments: 32, geometryType: 'Sphere', materialType: 'MeshNormal', objectColor: 0xf3d66a, wireframe: true, rotationSpeedX: 0.0007, rotationSpeedY: 0.0007, groupRotationZ: 0.0006 // Color ignored by MeshNormalMaterial
    },
    december: { // New Track: Deep winter minor - Dark Cyan Octahedron, 12 segments, slow pulse
        key: 'F#', scale: 'minor', droneOctave: 2, melodyOctave: 3, melodyLoopInterval: '2m', droneSequencePattern: [0, 4], droneSequenceInterval: '6m', reverbWet: 0.8, melodyProb: 0.5,
        segments: 14, geometryType: 'TorusKnot', materialType: 'MeshPhong', objectColor: 0x2a8f83, wireframe: false, rotationSpeedX: 0.002, rotationSpeedY: 0.002, groupRotationZ: 0.0002
    },
    january2026: { // January 2026: Return to calm, foundational beginning - Blue Icosahedron, 6 segments
        key: 'C', scale: 'major', droneOctave: 2, melodyOctave: 4, melodyLoopInterval: '1m', droneSequencePattern: [0, 4], droneSequenceInterval: '4m', reverbWet: 0.9, melodyProb: 0.6,
        segments: 6, geometryType: 'Icosahedron', materialType: 'MeshPhong', objectColor: 0x6ab0f3, wireframe: true, rotationSpeedX: 0.005, rotationSpeedY: 0.003, groupRotationZ: 0.0005
    }
};

// --- Tone.js Audio Setup ---
function setupAudio() {
    droneSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 6, decay: 0.5, sustain: 1, release: 10 },
        volume: -28
    }).toDestination();
    melodySynth = new Tone.FMSynth({
        harmonicity: 1, modulationIndex: 1,
        oscillator: { type: "sine" },
        envelope: { attack: 2, decay: 0.5, sustain: 0.5, release: 8 },
        modulation: { type: "sine" },
        modulationEnvelope: { attack: 2, decay: 1, sustain: 0.5, release: 8 },
        volume: -22
    }).toDestination();
    reverb = new Tone.Reverb({ decay: 10, wet: 0.6 }).toDestination();
    delay = new Tone.FeedbackDelay("2n.", 0.5).toDestination();
    droneSynth.connect(reverb); droneSynth.connect(delay);
    melodySynth.connect(reverb); melodySynth.connect(delay);
    melodyLoop = new Tone.Loop((time) => {
        // Need to handle case where trackParams might not exist yet? No, currentTrack is set.
        const trackParams = tracks[currentTrack]; 
        const melodyProb = trackParams ? trackParams.melodyProb : 0.6;
        if (Math.random() > melodyProb) return;
        // Note: Perlin noise was from p5, remove/replace later if needed
        // For now, just pick a random note
        if (currentMelodyNotes.length > 0) {
            let index = Math.floor(Math.random() * currentMelodyNotes.length);
            let note = currentMelodyNotes[index];
            melodySynth.triggerAttackRelease(note, "1n", time);
        }
    }, "1m");
    melodyLoop.humanize = true;
    droneSequence = new Tone.Sequence((time, note) => {
        droneSynth.triggerAttackRelease(note, "4m", time);
    }, [], "4m");
    droneSequence.loop = true;
    Tone.start().then(() => {
        console.log('Audio context started.');
        Tone.Transport.start("+0.1");
        updateAudioForTrack(); 
        console.log('Drone Sequence and Melody Loop started for initial track:', currentTrack);
    }).catch(e => {
        console.error("Error starting Tone.js:", e);
    });
}

// --- Three.js Setup, Animation, and Update ---
function initThreeJS() {
    canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) { console.error("Canvas container not found!"); return; }
    scene = new THREE.Scene();
    const aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 4;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(currentBgColorThree);
    canvasContainer.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create the main kaleidoscope group
    kaleidoscopeGroup = new THREE.Group();
    scene.add(kaleidoscopeGroup);

    // Initial creation of segments based on default track (track1)
    createKaleidoscopeSegments(tracks[currentTrack]); 

    window.addEventListener('resize', onWindowResize, false);
    animateThreeJS();
    console.log("Three.js Initialized");
}

function createKaleidoscopeSegments(params) {
    // Clear previous segments and objects
    while (kaleidoscopeGroup.children.length) {
        kaleidoscopeGroup.remove(kaleidoscopeGroup.children[0]);
    }
    segmentObjects = [];

    const numSegments = params.segments || 6;
    const angleIncrement = (Math.PI * 2) / numSegments;

    // Create base geometry based on type
    let geometry;
    switch (params.geometryType) {
        case 'Box': geometry = new THREE.BoxGeometry(1, 1, 1); break;
        case 'Sphere': geometry = new THREE.SphereGeometry(0.8, 32, 16); break;
        case 'Torus': geometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100); break;
        case 'TorusKnot': geometry = new THREE.TorusKnotGeometry(0.6, 0.15, 100, 16); break;
        case 'Octahedron': geometry = new THREE.OctahedronGeometry(0.8); break;
        case 'Dodecahedron': geometry = new THREE.DodecahedronGeometry(0.9); break;
        case 'Tetrahedron': geometry = new THREE.TetrahedronGeometry(1); break;
        case 'Icosahedron':
        default: geometry = new THREE.IcosahedronGeometry(0.8); break;
    }

    // Create base material based on type
    let material;
    const materialOptions = { 
        color: params.objectColor || 0xffffff,
        wireframe: params.wireframe || false,
        roughness: params.roughness !== undefined ? params.roughness : 0.5, // Default roughness for Standard
        metalness: params.metalness !== undefined ? params.metalness : 0.1  // Default metalness for Standard
    };
    switch (params.materialType) {
        case 'MeshBasic': material = new THREE.MeshBasicMaterial(materialOptions); break;
        case 'MeshNormal': material = new THREE.MeshNormalMaterial(materialOptions); break; // Color/wireframe ignored
        case 'MeshStandard': material = new THREE.MeshStandardMaterial(materialOptions); break;
        case 'MeshPhong':
        default: material = new THREE.MeshPhongMaterial(materialOptions); break;
    }

    // Create segments
    for (let i = 0; i < numSegments; i++) {
        const segmentContainer = new THREE.Group(); // Container for rotation
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position the mesh slightly off-center within its container for kaleidoscope effect
        mesh.position.x = 1.5; 
        
        segmentContainer.add(mesh);
        segmentContainer.rotation.z = i * angleIncrement;
        
        kaleidoscopeGroup.add(segmentContainer);
        segmentObjects.push(mesh); // Store the mesh itself for individual animation
    }
}

function updateVisualsForTrack() {
    if (!scene) return; // Ensure Three.js is initialized

    const newTrackParams = tracks[currentTrack];
    if (!newTrackParams) {
        console.error("Visual parameters not found for track:", currentTrack);
        return;
    }

    // Store current params for animation loop
    currentVisParams = newTrackParams;

    // Recreate the whole kaleidoscope scene for simplicity
    // Could optimize later to only update materials/positions if needed
    createKaleidoscopeSegments(newTrackParams);

    console.log(`Visuals updated for Track: ${currentTrack}`);
}

function animateThreeJS() {
    animationFrameId = requestAnimationFrame(animateThreeJS);

    const rotX = currentVisParams.rotationSpeedX || 0.005;
    const rotY = currentVisParams.rotationSpeedY || 0.003;
    const groupRotZ = currentVisParams.groupRotationZ || 0.0005;

    // Rotate the main group
    if (kaleidoscopeGroup) {
        kaleidoscopeGroup.rotation.z += groupRotZ;
    }
    // Rotate individual segment objects
    segmentObjects.forEach(obj => {
        if(obj) {
             obj.rotation.x += rotX;
             obj.rotation.y += rotY;
        }
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    if (!renderer || !camera || !canvasContainer) return;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

// Function to initialize audio AND START VISUALS (now Three.js)
function initAudioAndStart() {
    if (!audioInitialized) {
        console.log("Play button clicked, initializing Three.js and audio...");
        initThreeJS(); 
        updateVisualsForTrack(); 
        setupAudio();
        audioInitialized = true;
        
        // --- Hide UI Elements --- 
        if (playButton) playButton.classList.add('hidden');
        if (mainTitleElement) mainTitleElement.classList.add('hidden'); // Hide title

        // --- Show Controls ---
        if (trackControls) trackControls.style.display = 'flex';
        document.body.classList.add('playing');
        
        console.log('Three.js Visuals and Audio Initialized by play button.');
        startTrackTimer();
    } else { console.log("Already initialized."); }
}


// --- Track Advancement Logic ---
const TRACK_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds

// Helper function to check if a track is enabled in the dropdown
function isTrackEnabled(trackKey) {
    if (!trackSelect) return true; // Assume enabled if dropdown not found
    const option = trackSelect.querySelector(`option[value="${trackKey}"]`);
    return option ? !option.disabled : true; // Enabled if option exists and is not disabled
}

function advanceTrack() {
    console.log(`Track ${currentTrack} finished after ${TRACK_DURATION / 60000} minutes. Advancing...`);

    const trackKeys = Object.keys(tracks);
    let currentIndex = trackKeys.indexOf(currentTrack);
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex = currentIndex;
    let nextTrackKey = null;
    let attempts = 0; // Prevent infinite loops if all are disabled

    // Loop to find the next *enabled* track
    do {
        nextIndex = (nextIndex + 1) % trackKeys.length; 
        nextTrackKey = trackKeys[nextIndex];
        attempts++;
    } while (!isTrackEnabled(nextTrackKey) && attempts <= trackKeys.length);

    // If we somehow looped through all and none are enabled, stay put
    if (!isTrackEnabled(nextTrackKey)) {
        console.warn("Could not find an enabled track to advance to. Staying on current track.");
        // Still restart the timer for the current track
        startTrackTimer();
        return; 
    }

    // --- Found enabled track --- 

    // Update state
    currentTrack = nextTrackKey;

    // Update UI dropdown
    if (trackSelect) {
        trackSelect.value = currentTrack;
    }

    // Update audio and visuals
    updateAudioForTrack();

    // Restart timer for the new track (handled by updateAudioForTrack)
    // startTrackTimer(); 
}

function startTrackTimer() {
    // Clear any existing timer
    if (trackAdvanceTimerId !== null) {
        clearTimeout(trackAdvanceTimerId);
        console.log("Cleared previous track advance timer.");
    }
    
    // Set a new timer
    console.log(`Starting 20-minute timer for track ${currentTrack}`);
    trackAdvanceTimerId = setTimeout(advanceTrack, TRACK_DURATION);
}

function updateAudioForTrack() {
    if (!droneSynth || !melodyLoop || !droneSequence || !reverb || !delay ) return; 
    const trackParams = tracks[currentTrack]; 
    if (!trackParams) { console.error("Track parameters not found for:", currentTrack); return; }
    const { key, scale, droneOctave, melodyOctave, melodyLoopInterval, droneSequencePattern, droneSequenceInterval, reverbWet } = trackParams;
    const scheduleTime = Tone.now() + 0.2;
    // Update Melody
    currentMelodyNotes = getScaleNotes(key, scale, melodyOctave);
    melodyLoop.interval = melodyLoopInterval; 
    if (melodyLoop.state !== "started") { melodyLoop.start(scheduleTime); }
    // Update Drone
    const droneScaleNotes = getScaleNotes(key, scale, droneOctave);
    const droneNotesForSequence = droneSequencePattern.map(index => droneScaleNotes[index % droneScaleNotes.length]);
    droneSequence.stop(scheduleTime - 0.1);
    droneSequence.clear();
    droneSequence.events = droneNotesForSequence;
    droneSequence.interval = droneSequenceInterval;
    droneSynth.releaseAll(scheduleTime - 0.1);
    if (droneSequence.state !== "started") { droneSequence.start(scheduleTime); }
    // Update Effects
    reverb.wet.value = reverbWet;
    console.log(`Audio updated for Track: ${currentTrack}, Key: ${key}, Scale: ${scale}, MelodyNotes: ${currentMelodyNotes.join(', ')}, DroneSeq: ${droneNotesForSequence.join(', ')}, MelodyInt: ${melodyLoopInterval}, DroneInt: ${droneSequenceInterval}, Reverb: ${reverbWet}`);
    
    // --- Update Visuals when track changes --- 
    updateVisualsForTrack(); // Call the new visual update function

    // Reset audio timer
    if (audioInitialized) {
        startTrackTimer();
    }
}

// --- Theme Handling ---
function applyThemePreference() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        isDarkMode = storedTheme === 'dark';
    } else {
        isDarkMode = document.body.classList.contains('dark');
    }
    if (themeCheckbox) {
        themeCheckbox.checked = isDarkMode;
    }
    setTheme(isDarkMode);
}

function setTheme(dark) {
    isDarkMode = dark;
    if (isDarkMode) {
        document.body.classList.add('dark');
        currentBgColorThree = bgColorDarkThree;
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        currentBgColorThree = bgColorLightThree;
        localStorage.setItem('theme', 'light');
    }
    // Update Three.js background color IF renderer exists
    if (renderer) {
        renderer.setClearColor(currentBgColorThree);
    }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    trackSelect = document.getElementById('track-select');
    playButton = document.getElementById('play-button');
    trackControls = document.getElementById('track-controls');
    themeCheckbox = document.getElementById('theme-checkbox'); 
    mainTitleElement = document.getElementById('main-title'); // Get title element
    if (trackSelect) {
        trackSelect.addEventListener('change', (event) => {
            currentTrack = event.target.value; 
            if (audioInitialized) {
                updateAudioForTrack(); 
            }
        });
        currentTrack = trackSelect.value;
    }
    if (playButton) {
        playButton.addEventListener('click', initAudioAndStart);
    } else { console.error("Play button not found!"); }
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', () => {
            setTheme(themeCheckbox.checked);
        });
    } else {
        console.error("Theme checkbox not found!");
    }
    applyThemePreference();
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Don't instantiate visuals here anymore
    setupEventListeners(); // Setup listeners, play button will init Three.js & audio
});

// --- Scale and Key Logic (Tone.js - Stays the same) ---
const scales = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonicMajor: [0, 2, 4, 7, 9],
    pentatonicMinor: [0, 3, 5, 7, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10]
};

function getScaleNotes(key, scaleName, octave) {
    const rootNote = Tone.Frequency(key + octave).toMidi();
    const scaleIntervals = scales[scaleName];
    if (!scaleIntervals) { console.error("Scale not found:", scaleName); return [key + octave]; }
    return scaleIntervals.map(interval => Tone.Frequency(rootNote + interval, 'midi').toNote());
} 