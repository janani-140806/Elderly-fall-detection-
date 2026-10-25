// Real-Time Pose Estimation & Temporal Fall Detection Service
// Supports MoveNet via TensorFlow.js Pose Detection (browser WebGL)

let detector = null;
let isInitializing = false;

// Default Configurable Thresholds for Tuning during Testing
export const DEFAULT_DETECTION_THRESHOLDS = {
  // Downward drop velocity (frame fraction per second)
  dropVelocityThreshold: 0.28,
  // Minimum vertical drop magnitude over 0.5s window (normalized 0 to 1)
  dropMagnitudeThreshold: 0.12,
  // Body angle deviation from vertical (degrees) to be considered horizontal
  horizontalAngleThreshold: 58,
  // Low body position threshold (normalized Y where 0=top, 1=bottom of frame)
  lowPositionThreshold: 0.62,
  // Aspect ratio (height/width) threshold below which body is horizontal
  horizontalAspectThreshold: 1.05,
  // Minimum confidence score (0 to 100%) to trigger Fall Detected
  confidenceTriggerThreshold: 80,
  // Duration in ms person must remain in horizontal/low state
  immobilityDurationMs: 400
};

// Initialize the Pose Detector Model
export async function initPoseDetector() {
  if (detector) return detector;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(r => setTimeout(r, 100));
    }
    return detector;
  }

  isInitializing = true;
  try {
    // Check if poseDetection is available globally via script or import
    let poseDetectionLib = window.poseDetection;
    if (!poseDetectionLib) {
      // Dynamic import fallback
      poseDetectionLib = await import('@tensorflow-models/pose-detection');
    }

    if (window.tf) {
      await window.tf.setBackend('webgl');
      await window.tf.ready();
    }

    detector = await poseDetectionLib.createDetector(
      poseDetectionLib.SupportedModels.MoveNet,
      {
        modelType: poseDetectionLib.movenet?.modelType?.SINGLEPOSE_LIGHTNING || 'SinglePose.Lightning',
        enableSmoothing: true,
        minPoseScore: 0.25
      }
    );

    console.log('✅ MoveNet Pose Detector initialized successfully.');
    return detector;
  } catch (err) {
    console.error('Failed to initialize MoveNet detector:', err);
    throw err;
  } finally {
    isInitializing = false;
  }
}

// Estimate Poses from HTML Video Element
export async function estimatePoses(videoElement) {
  if (!detector) {
    await initPoseDetector();
  }
  if (!detector || !videoElement || videoElement.readyState < 2) {
    return [];
  }
  return await detector.estimatePoses(videoElement);
}

// Temporal Sliding Window for Multi-Frame Analysis
export class FallDetectionAnalyzer {
  constructor(customThresholds = {}) {
    this.thresholds = { ...DEFAULT_DETECTION_THRESHOLDS, ...customThresholds };
    this.history = []; // rolling history of last 30-45 frames
    this.maxHistoryLength = 40;
    this.fallTriggeredTime = null;
    this.currentState = 'NORMAL / STANDING';
    this.currentActivity = 'Standing';
    this.fallConfidence = 0;
    this.lastFallExplanation = '';
  }

  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  // Analyze single frame pose estimation
  processPose(pose, videoWidth = 640, videoHeight = 480) {
    if (!pose || !pose.keypoints || pose.keypoints.length === 0) {
      return {
        state: 'NO_PERSON',
        stateLabel: 'NO PERSON DETECTED',
        activity: 'None',
        fallScore: 0,
        isFall: false,
        metrics: null
      };
    }

    const keypoints = pose.keypoints;
    const now = Date.now();

    // Map MoveNet 17 Keypoints
    // 0: nose, 5: left_shoulder, 6: right_shoulder, 11: left_hip, 12: right_hip, 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle
    const kp = {};
    keypoints.forEach(k => {
      kp[k.name] = {
        x: k.x / videoWidth,
        y: k.y / videoHeight,
        score: k.score || 0
      };
    });

    const nose = kp['nose'] || { x: 0.5, y: 0.5, score: 0 };
    const leftShoulder = kp['left_shoulder'] || { x: 0.45, y: 0.3, score: 0 };
    const rightShoulder = kp['right_shoulder'] || { x: 0.55, y: 0.3, score: 0 };
    const leftHip = kp['left_hip'] || { x: 0.45, y: 0.6, score: 0 };
    const rightHip = kp['right_hip'] || { x: 0.55, y: 0.6, score: 0 };
    const leftKnee = kp['left_knee'] || { x: 0.45, y: 0.8, score: 0 };
    const rightKnee = kp['right_knee'] || { x: 0.55, y: 0.8, score: 0 };
    const leftAnkle = kp['left_ankle'] || { x: 0.45, y: 0.95, score: 0 };
    const rightAnkle = kp['right_ankle'] || { x: 0.55, y: 0.95, score: 0 };

    // Calculate midpoints
    const midShoulder = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };

    const midHip = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    const midKnee = {
      x: (leftKnee.x + rightKnee.x) / 2,
      y: (leftKnee.y + rightKnee.y) / 2
    };

    const midAnkle = {
      x: (leftAnkle.x + rightAnkle.x) / 2,
      y: (leftAnkle.y + rightAnkle.y) / 2
    };

    // Center of Mass (weighted towards hips and torso)
    const centerOfMassY = midHip.y * 0.6 + midShoulder.y * 0.4;
    const centerOfMassX = (midHip.x + midShoulder.x) / 2;

    // Body Orientation / Spine Vector Angle
    // Upright: midShoulder.y < midHip.y, deltaX is small
    const deltaX = Math.abs(midShoulder.x - midHip.x);
    const deltaY = Math.abs(midHip.y - midShoulder.y);
    // Angle in degrees from vertical (0 = vertical upright, 90 = flat horizontal)
    const bodyAngle = Math.round(Math.atan2(deltaX, Math.max(deltaY, 0.001)) * (180 / Math.PI));

    // Bounding Box Dimensions
    const validXs = keypoints.filter(k => (k.score || 0) > 0.2).map(k => k.x / videoWidth);
    const validYs = keypoints.filter(k => (k.score || 0) > 0.2).map(k => k.y / videoHeight);

    const minX = validXs.length > 0 ? Math.min(...validXs) : 0;
    const maxX = validXs.length > 0 ? Math.max(...validXs) : 1;
    const minY = validYs.length > 0 ? Math.min(...validYs) : 0;
    const maxY = validYs.length > 0 ? Math.max(...validYs) : 1;

    const boxWidth = Math.max(maxX - minX, 0.05);
    const boxHeight = Math.max(maxY - minY, 0.05);
    const aspectRatio = boxHeight / boxWidth; // >1.6 for standing, <1.0 for horizontal

    // Push into rolling temporal history
    const frameData = {
      timestamp: now,
      centerOfMassY,
      centerOfMassX,
      midHipY: midHip.y,
      midShoulderY: midShoulder.y,
      bodyAngle,
      aspectRatio,
      boxHeight,
      boxWidth
    };

    this.history.push(frameData);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    // Temporal Drop & Velocity Calculation
    // Compare current frame with past frames 300ms to 700ms ago
    let maxDownwardVelocity = 0;
    let maxDropMagnitude = 0;

    for (let i = 0; i < this.history.length - 2; i++) {
      const past = this.history[i];
      const timeDiffSec = (now - past.timestamp) / 1000;
      if (timeDiffSec >= 0.25 && timeDiffSec <= 0.85) {
        const drop = centerOfMassY - past.centerOfMassY;
        if (drop > 0) {
          const velocity = drop / timeDiffSec;
          if (velocity > maxDownwardVelocity) {
            maxDownwardVelocity = velocity;
          }
          if (drop > maxDropMagnitude) {
            maxDropMagnitude = drop;
          }
        }
      }
    }

    // Knee-Hip Folding Check (Distinguishes Sitting from Falling)
    // In sitting: midHip drops, but midShoulder stays high and torso angle remains vertical (< 30 deg)
    const isTorsoUpright = bodyAngle < 35;
    const isTorsoTilted = bodyAngle >= 35 && bodyAngle < this.thresholds.horizontalAngleThreshold;
    const isHorizontal = bodyAngle >= this.thresholds.horizontalAngleThreshold || aspectRatio < this.thresholds.horizontalAspectThreshold;
    const isLowPosition = centerOfMassY >= this.thresholds.lowPositionThreshold;

    // Movement Activity Classification (Standing vs Walking vs Sitting vs Bending)
    // Ankle / Knee movement variance over recent frames
    let recentCadenceMovement = 0;
    if (this.history.length >= 6) {
      const recent5 = this.history.slice(-6);
      const comXVariance = Math.max(...recent5.map(h => h.centerOfMassX)) - Math.min(...recent5.map(h => h.centerOfMassX));
      recentCadenceMovement = comXVariance;
    }

    // Multi-factor Fall Score Evaluation
    let suddenDropScore = 0;
    if (maxDownwardVelocity > this.thresholds.dropVelocityThreshold && maxDropMagnitude > this.thresholds.dropMagnitudeThreshold) {
      suddenDropScore = 35;
    } else if (maxDownwardVelocity > this.thresholds.dropVelocityThreshold * 0.7) {
      suddenDropScore = 20;
    }

    let horizontalScore = 0;
    if (isHorizontal) {
      horizontalScore = 30;
    } else if (isTorsoTilted) {
      horizontalScore = 15;
    }

    let lowPosScore = 0;
    if (isLowPosition) {
      lowPosScore = 20;
    } else if (centerOfMassY > 0.55) {
      lowPosScore = 10;
    }

    let aspectScore = 0;
    if (aspectRatio < 0.95) {
      aspectScore = 15;
    } else if (aspectRatio < 1.25) {
      aspectScore = 8;
    }

    const fallScore = Math.min(100, Math.round(suddenDropScore + horizontalScore + lowPosScore + aspectScore));
    this.fallConfidence = fallScore;

    // State Classification
    let state = 'NORMAL / STANDING';
    let activity = 'Standing Normally';
    let stateColor = 'emerald';
    let isFall = false;

    if (fallScore >= this.thresholds.confidenceTriggerThreshold && isHorizontal && isLowPosition) {
      state = 'FALL DETECTED';
      activity = 'Fall Event Confirmed';
      stateColor = 'red';
      isFall = true;
      this.fallTriggeredTime = now;
      this.lastFallExplanation = `Rapid downward velocity (${(maxDownwardVelocity).toFixed(2)} drop/sec) followed by a horizontal spine orientation (${bodyAngle}°) and low center-of-mass (${(centerOfMassY * 100).toFixed(0)}% frame height). All multi-frame temporal fall conditions satisfied.`;
    } else if (fallScore >= 50 || (suddenDropScore > 0 && isTorsoTilted)) {
      state = 'POSSIBLE FALL';
      activity = 'Abnormal Movement';
      stateColor = 'amber';
    } else if (isTorsoUpright && isLowPosition && aspectRatio < 1.6) {
      state = 'SITTING / BENDING';
      activity = 'Sitting Down';
      stateColor = 'yellow';
    } else if (isTorsoTilted && !isLowPosition) {
      state = 'SITTING / BENDING';
      activity = 'Bending Forward';
      stateColor = 'yellow';
    } else if (isTorsoUpright && recentCadenceMovement > 0.04) {
      state = 'WALKING';
      activity = 'Walking Gait';
      stateColor = 'blue';
    } else {
      state = 'NORMAL / STANDING';
      activity = 'Standing';
      stateColor = 'emerald';
    }

    this.currentState = state;
    this.currentActivity = activity;

    return {
      state,
      stateLabel: state,
      stateColor,
      activity,
      fallScore,
      isFall,
      explanation: this.lastFallExplanation,
      metrics: {
        bodyAngle,
        centerOfMassY: Math.round(centerOfMassY * 100),
        aspectRatio: parseFloat(aspectRatio.toFixed(2)),
        dropVelocity: parseFloat(maxDownwardVelocity.toFixed(2)),
        dropMagnitude: parseFloat(maxDropMagnitude.toFixed(2)),
        box: { minX, minY, maxX, maxY, width: boxWidth, height: boxHeight },
        keypoints: pose.keypoints
      }
    };
  }
}

// Draw Skeletons & Bounding Box Over Canvas
export function drawPoseOnCanvas(ctx, keypoints, videoWidth, videoHeight, stateInfo) {
  if (!ctx || !keypoints || keypoints.length === 0) return;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);

  // Connection pairs for MoveNet 17 keypoints
  const connections = [
    ['nose', 'left_eye'], ['nose', 'right_eye'],
    ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
    ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
  ];

  const kpMap = {};
  keypoints.forEach(k => {
    kpMap[k.name] = {
      x: (k.x / videoWidth) * width,
      y: (k.y / videoHeight) * height,
      score: k.score || 0
    };
  });

  // Color by State
  let lineColor = '#10b981'; // emerald
  let boxColor = 'rgba(16, 185, 129, 0.7)';
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (stateInfo.state === 'FALL DETECTED') {
    lineColor = '#ef4444'; // red
    boxColor = 'rgba(239, 68, 68, 0.9)';
    glowColor = 'rgba(239, 68, 68, 0.6)';
  } else if (stateInfo.state === 'POSSIBLE FALL') {
    lineColor = '#f59e0b'; // amber
    boxColor = 'rgba(245, 158, 11, 0.8)';
    glowColor = 'rgba(245, 158, 11, 0.4)';
  } else if (stateInfo.state === 'WALKING') {
    lineColor = '#3b82f6'; // blue
    boxColor = 'rgba(59, 130, 246, 0.8)';
    glowColor = 'rgba(59, 130, 246, 0.3)';
  } else if (stateInfo.state === 'SITTING / BENDING') {
    lineColor = '#eab308'; // yellow
    boxColor = 'rgba(234, 179, 8, 0.8)';
    glowColor = 'rgba(234, 179, 8, 0.3)';
  }

  // Draw Bounding Box
  if (stateInfo.metrics && stateInfo.metrics.box) {
    const b = stateInfo.metrics.box;
    const bx = b.minX * width;
    const by = b.minY * height;
    const bw = b.width * width;
    const bh = b.height * height;

    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Label pill
    ctx.fillStyle = boxColor;
    ctx.fillRect(bx, by - 24, Math.max(170, bw), 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillText(`${stateInfo.state} (${stateInfo.fallScore}%)`, bx + 6, by - 7);
  }

  // Draw Skeleton Lines
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;

  connections.forEach(([p1, p2]) => {
    const k1 = kpMap[p1];
    const k2 = kpMap[p2];
    if (k1 && k2 && k1.score > 0.25 && k2.score > 0.25) {
      ctx.beginPath();
      ctx.moveTo(k1.x, k1.y);
      ctx.lineTo(k2.x, k2.y);
      ctx.stroke();
    }
  });

  // Draw Joint Keypoint Circles
  ctx.shadowBlur = 0;
  keypoints.forEach(k => {
    if ((k.score || 0) > 0.25) {
      const x = (k.x / videoWidth) * width;
      const y = (k.y / videoHeight) * height;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}
