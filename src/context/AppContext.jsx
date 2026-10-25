import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  INITIAL_SETTINGS,
  INITIAL_EVENTS,
  INITIAL_ANALYTICS_DAYS,
  SCENARIO_PRESETS,
  PATIENT_PROFILES,
  INITIAL_CAREGIVER_CHAT
} from '../utils/mockData';
import { playBuzzerAlert, playCountdownTick, playSuccessChime } from '../utils/audio';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation: landing, dashboard, monitoring, simulation, alerts, history, analytics, hardware, settings, patients
  const [activeTab, setActiveTab] = useState('landing');

  // Multiple Patients / Residents state
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('safefall_patients');
      return saved ? JSON.parse(saved) : PATIENT_PROFILES;
    } catch (e) {
      return PATIENT_PROFILES;
    }
  });

  const [activePatientId, setActivePatientId] = useState(() => {
    try {
      const saved = localStorage.getItem('safefall_active_patient_id');
      return saved || PATIENT_PROFILES[0].id;
    } catch (e) {
      return PATIENT_PROFILES[0].id;
    }
  });

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  // Settings with localStorage persistence
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('safefall_settings');
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  });

  // Events with localStorage persistence
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('safefall_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  });

  // Caregiver simulated SMS chat state
  const [caregiverChat, setCaregiverChat] = useState(() => {
    try {
      const saved = localStorage.getItem('safefall_caregiver_chat');
      return saved ? JSON.parse(saved) : INITIAL_CAREGIVER_CHAT;
    } catch (e) {
      return INITIAL_CAREGIVER_CHAT;
    }
  });

  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);

  // System general state
  const [systemStatus, setSystemStatus] = useState('ACTIVE'); // ACTIVE, PAUSED, WARNING, EMERGENCY
  const [isMonitoringPaused, setIsMonitoringPaused] = useState(false);
  const [currentActivity, setCurrentActivity] = useState('NORMAL');
  
  // Dynamic Sensor Data
  const [sensorData, setSensorData] = useState({
    acceleration: 9.8,
    velocity: 0.2,
    bodyAngle: 6,
    movement: 'Normal',
    impact: 'Low',
    fallConfidence: 4,
    severity: 'Normal',
    status: 'SAFE',
    gyroscope: { x: 0.1, y: 0.2, z: -0.1 },
    time: 'Live'
  });

  // Live telemetry stream history for charting
  const [telemetryHistory, setTelemetryHistory] = useState(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      initial.push({
        time: new Date(now - i * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        accel: 9.8 + (Math.random() * 0.4 - 0.2),
        angle: 6 + (Math.random() * 2 - 1),
        confidence: 4
      });
    }
    return initial;
  });

  // Algorithm Rule Evaluation Signals
  const [algorithmSignals, setAlgorithmSignals] = useState({
    highImpact: false,
    suddenAcceleration: false,
    bodyAngleChanged: false,
    movementDecreased: false,
    confidence: 4,
    severity: 'Normal',
    verdict: 'SAFE',
    explanation: 'Acceleration and gravitational posture remain within calibrated safety thresholds.'
  });

  // Fall Simulation Multi-Step Animation state
  const [fallSimStep, setFallSimStep] = useState(0); // 0=idle, 1-6=steps
  const [fallSimStatusText, setFallSimStatusText] = useState('');
  const [isSimulatingFall, setIsSimulatingFall] = useState(false);

  // False Alarm / Verification Countdown Modal
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const [countdownReason, setCountdownReason] = useState('Fall Detection Triggered');
  const countdownTimerRef = useRef(null);

  // Emergency Response State
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyDetails, setEmergencyDetails] = useState(null);
  const [dispatches, setDispatches] = useState({
    caregiverNotified: false,
    smsSent: false,
    buzzerActive: false,
    locationShared: false,
    emergencyEventCreated: false
  });

  // Inactivity / No Movement Modal
  const [noMovementModalOpen, setNoMovementModalOpen] = useState(false);

  // In-App Toast Notifications
  const [notifications, setNotifications] = useState([]);

  // Demo Walkthrough Mode
  const [demoState, setDemoState] = useState({
    isRunning: false,
    step: 0,
    title: '',
    progress: 0
  });
  const demoTimeoutRef = useRef(null);

  // Add toast notification
  const notify = useCallback((type, title, message, duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newNote = { id, type, title, message };
    setNotifications(prev => [newNote, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Switch Active Patient Profile
  const switchPatient = useCallback((patientId) => {
    const target = patients.find(p => p.id === patientId);
    if (!target) return;

    setActivePatientId(patientId);
    try {
      localStorage.setItem('safefall_active_patient_id', patientId);
    } catch (e) {}

    // Synchronize settings with the active patient's profile
    setSettings(prev => ({
      ...prev,
      userName: `${target.name} (${target.userCode})`,
      userAge: target.age,
      roomLocation: target.roomLocation,
      emergencyContactName: target.caregiverName,
      emergencyContactPhone: target.caregiverPhone,
      emergencyContactRelation: target.caregiverRelation,
      secondaryContactName: target.secondaryContact,
      impactThreshold: target.impactThreshold || 18.5,
      angleThreshold: target.angleThreshold || 60,
      alertCountdownDuration: target.countdownDuration || 10,
      gpsCoordinates: target.gpsCoordinates || prev.gpsCoordinates
    }));

    notify('info', 'Patient Switched', `Active monitoring shifted to ${target.name} (${target.userCode}). Assigned Caregiver: ${target.caregiverName}`);
  }, [patients, notify]);

  // Add a new patient profile
  const addPatient = useCallback((patientData) => {
    const newP = {
      id: `P-00${patients.length + 1}`,
      userCode: `User #00${patients.length + 1}`,
      avatarInitials: patientData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      avatarBg: ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-teal-600'][patients.length % 5],
      gpsCoordinates: {
        lat: 37.7750 + (Math.random() * 0.004 - 0.002),
        lng: -122.4190 + (Math.random() * 0.004 - 0.002),
        address: patientData.roomLocation || "Care Center Residential Suite",
        zone: "Indoor Residence (WiFi Geofenced)"
      },
      ...patientData
    };

    setPatients(prev => {
      const updated = [...prev, newP];
      try {
        localStorage.setItem('safefall_patients', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    notify('safe', 'Patient Enrolled', `${newP.name} successfully registered in patient directory.`);
    return newP;
  }, [patients, notify]);

  // Save settings helper
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      try {
        localStorage.setItem('safefall_settings', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });
    notify('success', 'Settings Saved', 'Detection parameters and contact preferences updated.');
  }, [notify]);

  // Add new event to history
  const addEvent = useCallback((eventData) => {
    const newEvent = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawTime: new Date().toISOString(),
      activity: eventData.activity || 'Unknown',
      detection: eventData.detection || 'Event Logged',
      confidence: eventData.confidence ?? 0,
      severity: eventData.severity || 'Normal',
      response: eventData.response || 'None',
      status: eventData.status || 'Logged',
      signals: eventData.signals || [],
      isSimulated: true,
      ...eventData
    };

    setEvents(prev => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem('safefall_events', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    return newEvent;
  }, [activePatient]);

  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
    try {
      localStorage.removeItem('safefall_events');
    } catch (e) {}
    notify('info', 'History Cleared', 'All simulation records have been reset.');
  }, [notify]);

  // Periodic sensor jitter when active (mimics live sensor polling)
  useEffect(() => {
    if (isMonitoringPaused || isSimulatingFall || isEmergencyActive || countdownActive) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        let jitterAcc = 0;
        let jitterAngle = 0;

        if (currentActivity === 'NORMAL') {
          jitterAcc = (Math.random() * 0.3 - 0.15);
          jitterAngle = (Math.random() * 1 - 0.5);
        } else if (currentActivity === 'WALKING') {
          jitterAcc = (Math.random() * 1.2 - 0.6);
          jitterAngle = (Math.random() * 3 - 1.5);
        } else if (currentActivity === 'SITTING') {
          jitterAcc = (Math.random() * 0.1 - 0.05);
          jitterAngle = (Math.random() * 0.6 - 0.3);
        }

        const newAccel = Math.max(0, Number((prev.acceleration + jitterAcc * 0.2).toFixed(2)));
        const newAngle = Math.max(0, Math.min(90, Math.round(prev.bodyAngle + jitterAngle * 0.3)));

        return {
          ...prev,
          acceleration: newAccel,
          bodyAngle: newAngle
        };
      });

      // Update telemetry history
      setTelemetryHistory(prev => {
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const next = [
          ...prev.slice(1),
          {
            time: nowStr,
            accel: sensorData.acceleration,
            angle: sensorData.bodyAngle,
            confidence: sensorData.fallConfidence
          }
        ];
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isMonitoringPaused, isSimulatingFall, isEmergencyActive, countdownActive, currentActivity, sensorData.acceleration, sensorData.bodyAngle, sensorData.fallConfidence]);

  // Start verification countdown
  const startVerificationCountdown = useCallback((reason = 'Fall Detected') => {
    setCountdownReason(reason);
    setCountdownSeconds(settings.alertCountdownDuration || 10);
    setCountdownActive(true);

    if (settings.buzzerAudioEnabled) {
      playCountdownTick();
    }
  }, [settings.alertCountdownDuration, settings.buzzerAudioEnabled]);

  // Caregiver replies to simulated SMS
  const sendCaregiverReply = useCallback((replyText, actionType = 'custom') => {
    const replyMsg = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      sender: `${activePatient.caregiverName} (Caregiver)`,
      isAutomated: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      content: replyText,
      type: 'caregiver_reply',
      status: 'Delivered (Simulated)'
    };

    setCaregiverChat(prev => {
      const updated = [...prev, replyMsg];
      try {
        localStorage.setItem('safefall_caregiver_chat', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    notify('safe', 'Caregiver Replied via SMS', `"${replyText.substring(0, 45)}..."`);

    // Log caregiver response event in audit history
    addEvent({
      activity: "Caregiver SMS Response",
      detection: `Acknowledged by ${activePatient.caregiverName}`,
      confidence: 100,
      severity: "Medium",
      response: `Caregiver Action: ${replyText}`,
      status: actionType === 'resolved' ? 'Resolved' : 'Attended',
      signals: [`Action: ${actionType.toUpperCase()}`, `Caregiver: ${activePatient.caregiverName}`]
    });

    if (actionType === 'resolved') {
      setIsEmergencyActive(false);
      setSystemStatus('ACTIVE');
      setCurrentActivity('NORMAL');
      playSuccessChime();
    }
  }, [activePatient, notify, addEvent]);

  // Trigger Emergency Response
  const triggerEmergencyResponse = useCallback((customDetails = null) => {
    setCountdownActive(false);
    clearInterval(countdownTimerRef.current);

    const fallDetails = customDetails || {
      userId: `${activePatient.name} (${activePatient.userCode})`,
      patientId: activePatient.id,
      severity: "HIGH",
      confidence: 94,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: activePatient.roomLocation || settings.roomLocation,
      zone: activePatient.gpsCoordinates?.zone || "Indoor Residence",
      signals: ["High Impact (24.8 m/s²)", "Angle Tilt 82°", "Zero Post-Impact Velocity"]
    };

    setEmergencyDetails(fallDetails);
    setIsEmergencyActive(true);
    setSystemStatus('EMERGENCY');

    // Simulate dispatches
    setDispatches({
      caregiverNotified: true,
      smsSent: true,
      buzzerActive: true,
      locationShared: true,
      emergencyEventCreated: true
    });

    // Create realistic Caregiver SMS Alert message
    const autoSMS = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      sender: "SafeFall AI Dispatch",
      isAutomated: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      content: `🚨 [CRITICAL ALERT] SafeFall AI Emergency Notification\n\nSubject: ${activePatient.name} (${activePatient.userCode}, Age ${activePatient.age})\nSeverity: ${fallDetails.severity} (Confidence: ${fallDetails.confidence}%)\nImpact: ${sensorData.acceleration} m/s² | Body Angle: ${sensorData.bodyAngle}°\nLocation: ${activePatient.roomLocation}\nSimulated GPS: ${activePatient.gpsCoordinates?.lat.toFixed(4)}° N, ${Math.abs(activePatient.gpsCoordinates?.lng).toFixed(4)}° W\n\nStatus: Resident did not respond to 10s safety prompt. 90dB local buzzer siren is ACTIVE.\n\nSimulated Map Link: https://safefall.ai/map?subject=${activePatient.id}`,
      type: "emergency_alert",
      status: "Delivered (Simulated)"
    };

    setCaregiverChat(prev => {
      const updated = [...prev, autoSMS];
      try {
        localStorage.setItem('safefall_caregiver_chat', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (settings.buzzerAudioEnabled) {
      playBuzzerAlert();
    }

    notify('emergency', 'EMERGENCY ALERT TRIGGERED', `SMS dispatched to ${activePatient.caregiverName} (${activePatient.caregiverPhone}).`);

    // Save to history
    addEvent({
      patientId: activePatient.id,
      patientName: activePatient.name,
      activity: "Fall",
      detection: "Fall Confirmed",
      confidence: fallDetails.confidence,
      severity: fallDetails.severity,
      response: `Simulated SMS Sent to ${activePatient.caregiverName}`,
      status: "Emergency Active",
      signals: fallDetails.signals
    });

    // Switch to Alerts view
    setActiveTab('alerts');
  }, [activePatient, settings, sensorData.acceleration, sensorData.bodyAngle, notify, addEvent]);

  // User confirmed "I'm OK" (False Alarm)
  const confirmUserSafe = useCallback(() => {
    setCountdownActive(false);
    clearInterval(countdownTimerRef.current);
    playSuccessChime();

    setSensorData(prev => ({
      ...prev,
      status: 'SAFE',
      severity: 'Normal',
      fallConfidence: 15
    }));
    setSystemStatus('ACTIVE');
    setCurrentActivity('NORMAL');

    notify('safe', 'User Confirmed Safe', 'False alarm logged. Monitoring returned to normal.');

    addEvent({
      patientId: activePatient.id,
      patientName: activePatient.name,
      activity: currentActivity === 'FALL DETECTED' ? 'Fall' : currentActivity,
      detection: "False Alarm / User Confirmed Safe",
      confidence: sensorData.fallConfidence,
      severity: "Medium",
      response: "False Alarm Verified",
      status: "User Safe",
      signals: ["User clicked I'm OK within countdown window"]
    });
  }, [activePatient, currentActivity, sensorData.fallConfidence, notify, addEvent]);

  // Countdown timer tick effect
  useEffect(() => {
    if (!countdownActive) return;

    countdownTimerRef.current = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          triggerEmergencyResponse();
          return 0;
        }
        if (settings.buzzerAudioEnabled) {
          playCountdownTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimerRef.current);
  }, [countdownActive, triggerEmergencyResponse, settings.buzzerAudioEnabled]);

  // Scenario Trigger Function
  const triggerScenario = useCallback((scenarioKey) => {
    if (isSimulatingFall) return;

    if (scenarioKey === 'NORMAL') {
      const preset = SCENARIO_PRESETS.NORMAL;
      setCurrentActivity('NORMAL');
      setSystemStatus('ACTIVE');
      setSensorData({ ...preset, time: 'Live' });
      setAlgorithmSignals({
        highImpact: false,
        suddenAcceleration: false,
        bodyAngleChanged: false,
        movementDecreased: false,
        confidence: preset.fallConfidence,
        severity: preset.severity,
        verdict: 'SAFE',
        explanation: 'All sensor dynamics reflect peaceful resting or natural slight standing posture.'
      });
      notify('info', 'Scenario: Normal Activity', `Sensor feed set to nominal baseline for ${activePatient.name}.`);
    } else if (scenarioKey === 'WALKING') {
      const preset = SCENARIO_PRESETS.WALKING;
      setCurrentActivity('WALKING');
      setSystemStatus('ACTIVE');
      setSensorData({ ...preset, time: 'Live' });
      setAlgorithmSignals({
        highImpact: false,
        suddenAcceleration: false,
        bodyAngleChanged: false,
        movementDecreased: false,
        confidence: preset.fallConfidence,
        severity: preset.severity,
        verdict: 'SAFE',
        explanation: 'Rhythmic acceleration consistent with bipedal stride cadence.'
      });
      notify('info', 'Scenario: Walking', `Simulating gait dynamics for ${activePatient.name}.`);
    } else if (scenarioKey === 'SITTING') {
      const preset = SCENARIO_PRESETS.SITTING;
      setCurrentActivity('SITTING');
      setSystemStatus('ACTIVE');
      setSensorData({ ...preset, time: 'Live' });
      setAlgorithmSignals({
        highImpact: false,
        suddenAcceleration: false,
        bodyAngleChanged: false,
        movementDecreased: false,
        confidence: preset.fallConfidence,
        severity: preset.severity,
        verdict: 'SAFE',
        explanation: 'Controlled transition into seated posture without abrupt impact spikes.'
      });
      notify('info', 'Scenario: Sitting Down', 'Body angle seated at 28°, movement minimal and safe.');
    } else if (scenarioKey === 'SUDDEN_MOVEMENT') {
      const preset = SCENARIO_PRESETS.SUDDEN_MOVEMENT;
      setCurrentActivity('SUDDEN MOVEMENT');
      setSystemStatus('WARNING');
      setSensorData({ ...preset, time: 'Live' });
      setAlgorithmSignals({
        highImpact: false,
        suddenAcceleration: true,
        bodyAngleChanged: false,
        movementDecreased: false,
        confidence: preset.fallConfidence,
        severity: preset.severity,
        verdict: 'WARNING',
        explanation: 'High acceleration spike detected, but posture orientation remained above critical threshold.'
      });
      notify('warning', 'Scenario: Sudden Movement', `Abnormal motion spike recorded for ${activePatient.name}.`);
      addEvent({
        activity: "Sudden Movement",
        detection: "Warning Triggered",
        confidence: preset.fallConfidence,
        severity: "Medium",
        response: "Monitored",
        status: "Warning Logged",
        signals: ["Sudden Acceleration Spike (15.8 m/s²)", "Angle retained at 38°"]
      });
    } else if (scenarioKey === 'NO_MOVEMENT') {
      const preset = SCENARIO_PRESETS.NO_MOVEMENT;
      setCurrentActivity('NO MOVEMENT');
      setSystemStatus('WARNING');
      setSensorData({ ...preset, time: 'Live' });
      setAlgorithmSignals({
        highImpact: false,
        suddenAcceleration: false,
        bodyAngleChanged: true,
        movementDecreased: true,
        confidence: preset.fallConfidence,
        severity: preset.severity,
        verdict: 'PROLONGED INACTIVITY',
        explanation: 'Subject stationary in horizontal orientation for abnormal duration.'
      });
      setNoMovementModalOpen(true);
      notify('warning', 'Prolonged Inactivity Detected', `Subject ${activePatient.name} motionless in horizontal plane.`);
    } else if (scenarioKey === 'FALL') {
      // Execute the requested 6-step animated fall sequence
      setIsSimulatingFall(true);
      setCurrentActivity('FALL SEQUENCE');
      setSystemStatus('WARNING');

      // Step 1: Monitoring movement...
      setFallSimStep(1);
      setFallSimStatusText(`Monitoring movement baseline for ${activePatient.name}...`);
      setSensorData({
        acceleration: 10.4,
        velocity: 1.1,
        bodyAngle: 10,
        movement: 'Normal',
        impact: 'Low',
        fallConfidence: 8,
        severity: 'Normal',
        status: 'SAFE',
        gyroscope: { x: 0.8, y: -0.4, z: 1.1 },
        time: 'Live'
      });

      // Step 2: Sudden acceleration detected...
      setTimeout(() => {
        setFallSimStep(2);
        setFallSimStatusText('Sudden acceleration detected (Free-fall transition)...');
        setSensorData({
          acceleration: 17.6,
          velocity: 2.8,
          bodyAngle: 35,
          movement: 'High / Jerk',
          impact: 'Moderate',
          fallConfidence: 45,
          severity: 'Medium',
          status: 'WARNING',
          gyroscope: { x: 7.2, y: 5.4, z: -8.1 },
          time: 'Live'
        });
        setAlgorithmSignals(prev => ({ ...prev, suddenAcceleration: true }));
      }, 1000);

      // Step 3: Abnormal body orientation detected...
      setTimeout(() => {
        setFallSimStep(3);
        setFallSimStatusText('Abnormal body orientation detected (Loss of vertical posture)...');
        setSensorData({
          acceleration: 19.8,
          velocity: 3.4,
          bodyAngle: 68,
          movement: 'Rapid Descent',
          impact: 'High',
          fallConfidence: 72,
          severity: 'HIGH',
          status: 'WARNING',
          gyroscope: { x: 14.1, y: 8.9, z: -12.4 },
          time: 'Live'
        });
        setAlgorithmSignals(prev => ({ ...prev, bodyAngleChanged: true }));
      }, 2000);

      // Step 4: High impact detected...
      setTimeout(() => {
        setFallSimStep(4);
        setFallSimStatusText('High impact detected (Peak contact force)...');
        setSensorData({
          acceleration: 26.4,
          velocity: 3.9,
          bodyAngle: 82,
          movement: 'Impact Shockwave',
          impact: 'Critical',
          fallConfidence: 89,
          severity: 'HIGH',
          status: 'WARNING',
          gyroscope: { x: 18.2, y: -16.4, z: 9.3 },
          time: 'Live'
        });
        setAlgorithmSignals(prev => ({ ...prev, highImpact: true }));
      }, 3000);

      // Step 5: Movement stopped...
      setTimeout(() => {
        setFallSimStep(5);
        setFallSimStatusText('Movement stopped (Post-impact immobility confirmed)...');
        setSensorData({
          acceleration: 9.8,
          velocity: 0.0,
          bodyAngle: 84,
          movement: 'Zero Motion',
          impact: 'Critical (Recorded)',
          fallConfidence: 94,
          severity: 'HIGH',
          status: 'WARNING',
          gyroscope: { x: 0.0, y: 0.0, z: 0.0 },
          time: 'Live'
        });
        setAlgorithmSignals(prev => ({ ...prev, movementDecreased: true }));
      }, 4200);

      // Step 6: Analyzing...
      setTimeout(() => {
        setFallSimStep(6);
        setFallSimStatusText('Analyzing multi-signal rule thresholds...');
      }, 5200);

      // Final: FALL DETECTED -> Trigger countdown
      setTimeout(() => {
        setIsSimulatingFall(false);
        setFallSimStep(7);
        setCurrentActivity('FALL DETECTED');
        setSystemStatus('FALL_DETECTED');
        
        setSensorData({
          acceleration: 24.8,
          velocity: 0.0,
          bodyAngle: 84,
          movement: 'Immobile',
          impact: 'Critical',
          fallConfidence: 94,
          severity: 'HIGH',
          status: 'FALL DETECTED',
          gyroscope: { x: 0.0, y: 0.0, z: 0.0 },
          time: 'Live'
        });

        setAlgorithmSignals({
          highImpact: true,
          suddenAcceleration: true,
          bodyAngleChanged: true,
          movementDecreased: true,
          confidence: 94,
          severity: 'HIGH',
          verdict: 'FALL DETECTED',
          explanation: `All 4 critical criteria satisfied for ${activePatient.name}: high contact impact + rapid acceleration + 84° horizontal orientation + post-impact immobility.`
        });

        notify('emergency', `FALL DETECTED: ${activePatient.name} (94%)`, 'Rule thresholds breached. 10s Verification countdown initiated.');

        // Trigger verification modal with countdown
        startVerificationCountdown(`Critical Fall Detected for ${activePatient.name}`);
      }, 6400);
    }
  }, [isSimulatingFall, activePatient, notify, addEvent, startVerificationCountdown]);

  // Reset Emergency / Mark Safe
  const resetEmergency = useCallback(() => {
    setIsEmergencyActive(false);
    setSystemStatus('ACTIVE');
    setCurrentActivity('NORMAL');
    setSensorData({ ...SCENARIO_PRESETS.NORMAL, time: 'Live' });
    setAlgorithmSignals({
      highImpact: false,
      suddenAcceleration: false,
      bodyAngleChanged: false,
      movementDecreased: false,
      confidence: 4,
      severity: 'Normal',
      verdict: 'SAFE',
      explanation: 'System reset to nominal monitoring state.'
    });
    setDispatches({
      caregiverNotified: false,
      smsSent: false,
      buzzerActive: false,
      locationShared: false,
      emergencyEventCreated: false
    });
    playSuccessChime();
    notify('safe', 'User Marked Safe', `Emergency cleared. Normal background safeguarding resumed for ${activePatient.name}.`);
  }, [activePatient, notify]);

  // Demo Walkthrough System
  const stopDemo = useCallback(() => {
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    setDemoState({
      isRunning: false,
      step: 0,
      title: '',
      progress: 0
    });
    notify('info', 'Demo Stopped', 'Automatic presentation sequence paused.');
  }, [notify]);

  const resetDemo = useCallback(() => {
    stopDemo();
    resetEmergency();
    setActiveTab('dashboard');
    notify('info', 'Demo Reset', 'System state reset to baseline.');
  }, [stopDemo, resetEmergency, notify]);

  const startDemo = useCallback(() => {
    stopDemo();
    setDemoState({
      isRunning: true,
      step: 1,
      title: `Step 1/8: Initializing Normal Monitoring (${activePatient.name})`,
      progress: 12
    });
    setActiveTab('dashboard');
    triggerScenario('NORMAL');
    notify('info', 'Demo Started', 'Running automated presentation workflow.');

    // Step 2: Show Walking (after 4.5s)
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({
        isRunning: true,
        step: 2,
        title: 'Step 2/8: Simulated Walking & Gait Telemetry',
        progress: 25
      });
      setActiveTab('monitoring');
      triggerScenario('WALKING');
    }, 4500);

    // Step 3: Sudden Movement / Stumble (after 9.5s)
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({
        isRunning: true,
        step: 3,
        title: 'Step 3/8: Sudden Movement & Warning State',
        progress: 38
      });
      triggerScenario('SUDDEN_MOVEMENT');
    }, 9500);

    // Step 4: Fall Simulation Trigger (after 14.5s)
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({
        isRunning: true,
        step: 4,
        title: 'Step 4/8: Initiating 6-Stage Fall Sequence',
        progress: 50
      });
      setActiveTab('simulation');
      triggerScenario('FALL');
    }, 14500);

    // Step 5: Countdown & Confirmation (after 22s)
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({
        isRunning: true,
        step: 5,
        title: 'Step 5/8: False Alarm Verification Countdown (10s)',
        progress: 65
      });
    }, 22000);

    // Step 6: Dispatch Emergency Response (after 26s)
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({
        isRunning: true,
        step: 6,
        title: `Step 6/8: Emergency Dispatch & SMS to ${activePatient.caregiverName}`,
        progress: 78
      });
      triggerEmergencyResponse();
      setIsCaregiverModalOpen(true);
    }, 26000);

    // Step 7: Inspect Event History (after 33s)
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({
        isRunning: true,
        step: 7,
        title: 'Step 7/8: Verifying Logged Event in Audit History',
        progress: 90
      });
      setIsCaregiverModalOpen(false);
      setActiveTab('history');
    }, 33000);

    // Step 8: View Analytics & Complete (after 39s)
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({
        isRunning: false,
        step: 8,
        title: 'Step 8/8: Demo Complete – Reviewing Analytics',
        progress: 100
      });
      setActiveTab('analytics');
      notify('safe', 'Demo Sequence Completed', 'All 8 stages demonstrated successfully!');
    }, 39000);

  }, [stopDemo, resetEmergency, triggerScenario, triggerEmergencyResponse, activePatient, notify]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        patients,
        activePatientId,
        activePatient,
        switchPatient,
        addPatient,
        caregiverChat,
        isCaregiverModalOpen,
        setIsCaregiverModalOpen,
        sendCaregiverReply,
        systemStatus,
        setSystemStatus,
        isMonitoringPaused,
        setIsMonitoringPaused,
        currentActivity,
        setCurrentActivity,
        sensorData,
        setSensorData,
        telemetryHistory,
        algorithmSignals,
        settings,
        updateSettings,
        events,
        addEvent,
        clearEvents,
        isSimulatingFall,
        fallSimStep,
        fallSimStatusText,
        countdownActive,
        countdownSeconds,
        countdownReason,
        startVerificationCountdown,
        confirmUserSafe,
        triggerEmergencyResponse,
        isEmergencyActive,
        emergencyDetails,
        dispatches,
        resetEmergency,
        noMovementModalOpen,
        setNoMovementModalOpen,
        notifications,
        notify,
        removeNotification,
        demoState,
        startDemo,
        stopDemo,
        resetDemo,
        triggerScenario
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
