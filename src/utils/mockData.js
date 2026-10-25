// SafeFall AI - System Constants, Initial State & Mock Data

export const PATIENT_PROFILES = [
  {
    id: "P-001",
    name: "Eleanor Vance",
    userCode: "User #001",
    age: 74,
    gender: "Female",
    roomLocation: "Living Room – Primary Residence",
    roomNumber: "Apt 3B",
    riskLevel: "High", // Low, Moderate, High, Critical
    riskColor: "red",
    medicalNotes: "History of orthostatic hypotension & previous slip in bathroom. Mild osteoporosis.",
    caregiverName: "Sarah Vance",
    caregiverPhone: "+1 (555) 389-4402",
    caregiverRelation: "Daughter (Primary Family Caregiver)",
    secondaryContact: "Dr. Robert Chen (+1 555-702-8819)",
    avatarInitials: "EV",
    avatarBg: "bg-blue-600",
    impactThreshold: 18.5,
    angleThreshold: 60,
    countdownDuration: 10,
    gpsCoordinates: {
      lat: 37.7749,
      lng: -122.4194,
      address: "442 Maplewood Drive, Apt 3B, Simulated City",
      zone: "Indoor Residence (WiFi Geofenced)"
    }
  },
  {
    id: "P-002",
    name: "Arthur Pendelton",
    userCode: "User #002",
    age: 81,
    gender: "Male",
    roomLocation: "Suite 12 – Ground Floor Bedroom",
    roomNumber: "Suite 12",
    riskLevel: "Critical",
    riskColor: "red",
    medicalNotes: "Post-hip arthroplasty rehabilitation. Early-stage Parkinsonian tremor with shuffle gait.",
    caregiverName: "Nurse James Miller",
    caregiverPhone: "+1 (555) 412-9901",
    caregiverRelation: "Assisted Living Staff Registered Nurse",
    secondaryContact: "Facility Emergency Desk (+1 555-900-3322)",
    avatarInitials: "AP",
    avatarBg: "bg-purple-600",
    impactThreshold: 16.0, // More sensitive threshold
    angleThreshold: 50,
    countdownDuration: 15,
    gpsCoordinates: {
      lat: 37.7758,
      lng: -122.4182,
      address: "Golden Oaks Care Facility, Suite 12",
      zone: "Assisted Living Facility Wing A"
    }
  },
  {
    id: "P-003",
    name: "Clara Oswald",
    userCode: "User #003",
    age: 68,
    gender: "Female",
    roomLocation: "Room 204 – Kitchen & Dining",
    roomNumber: "Room 204",
    riskLevel: "Moderate",
    riskColor: "amber",
    medicalNotes: "Type-2 Diabetes with occasional hypoglycemic dizzy spells. Active independent walker.",
    caregiverName: "Michael Oswald",
    caregiverPhone: "+1 (555) 873-1204",
    caregiverRelation: "Son & Power of Attorney",
    secondaryContact: "Visiting Physical Therapist (+1 555-234-8899)",
    avatarInitials: "CO",
    avatarBg: "bg-emerald-600",
    impactThreshold: 19.5,
    angleThreshold: 65,
    countdownDuration: 10,
    gpsCoordinates: {
      lat: 37.7738,
      lng: -122.4215,
      address: "812 Evergreen Terrace, Unit 204",
      zone: "Residential Condo Complex"
    }
  },
  {
    id: "P-004",
    name: "Robert Martinez",
    userCode: "User #004",
    age: 79,
    gender: "Male",
    roomLocation: "Patio / Sunroom Perimeter",
    roomNumber: "Villa 08",
    riskLevel: "High",
    riskColor: "red",
    medicalNotes: "Peripheral neuropathy in lower extremities. Uses single-point cane for outdoor locomotion.",
    caregiverName: "Elena Martinez",
    caregiverPhone: "+1 (555) 604-5511",
    caregiverRelation: "Spouse & Primary Co-resident",
    secondaryContact: "Community First Responder (+1 555-888-0112)",
    avatarInitials: "RM",
    avatarBg: "bg-amber-600",
    impactThreshold: 17.5,
    angleThreshold: 55,
    countdownDuration: 10,
    gpsCoordinates: {
      lat: 37.7766,
      lng: -122.4170,
      address: "Sunridge Senior Villas, Villa 08",
      zone: "Outdoor Perimeter / Garden Walkway"
    }
  }
];

export const INITIAL_SETTINGS = {
  userName: PATIENT_PROFILES[0].name + " (" + PATIENT_PROFILES[0].userCode + ")",
  userAge: PATIENT_PROFILES[0].age,
  roomLocation: PATIENT_PROFILES[0].roomLocation,
  emergencyContactName: PATIENT_PROFILES[0].caregiverName + " (" + PATIENT_PROFILES[0].caregiverRelation.split('(')[0].trim() + ")",
  emergencyContactPhone: PATIENT_PROFILES[0].caregiverPhone,
  emergencyContactRelation: PATIENT_PROFILES[0].caregiverRelation,
  secondaryContactName: PATIENT_PROFILES[0].secondaryContact,
  secondaryContactPhone: "+1 (555) 702-8819",
  detectionSensitivity: "Medium", // Low, Medium, High
  impactThreshold: 18.5, // m/s^2
  angleThreshold: 60, // degrees deviation from vertical
  alertCountdownDuration: 10, // seconds
  simulationSpeed: "Normal",
  buzzerAudioEnabled: true,
  autoNotificationEnabled: true,
  gpsCoordinates: PATIENT_PROFILES[0].gpsCoordinates
};

export const INITIAL_CAREGIVER_CHAT = [
  {
    id: "MSG-001",
    sender: "SafeFall AI Dispatch",
    isAutomated: true,
    time: "10:32 AM",
    date: "Today",
    content: "🚨 [CRITICAL ALERT] SafeFall AI Emergency Notification\n\nSubject: Eleanor Vance (User #001)\nSeverity: HIGH (Confidence: 94%)\nImpact: 24.8 m/s² | Tilt: 82°\nLocation: 442 Maplewood Drive, Apt 3B\nGPS: 37.7749° N, 122.4194° W\n\nStatus: Subject did not respond to 10s safety prompt. Simulated siren active.\n\nLive Map Link: https://safefall.ai/map/sim?id=P-001",
    type: "emergency_alert",
    status: "Delivered (Simulated)"
  },
  {
    id: "MSG-002",
    sender: "Sarah Vance (Caregiver)",
    isAutomated: false,
    time: "10:33 AM",
    date: "Today",
    content: "Received alert! I am 4 minutes away driving down Maplewood. Dispatched facility desk to check immediately.",
    type: "caregiver_reply",
    status: "Acknowledged (Simulated)"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "EVT-8921",
    patientId: "P-001",
    patientName: "Eleanor Vance",
    timestamp: "Today, 10:32 AM",
    rawTime: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    activity: "Fall",
    detection: "Fall Detected",
    confidence: 94,
    severity: "High",
    response: "Caregiver SMS Sent & Siren Active",
    status: "Resolved",
    signals: ["High Impact (22.4 m/s²)", "Angle Shift 78°", "Zero Post-Impact Velocity"],
    isSimulated: true
  },
  {
    id: "EVT-8920",
    patientId: "P-001",
    patientName: "Eleanor Vance",
    timestamp: "Today, 10:15 AM",
    rawTime: new Date(Date.now() - 3600000 * 3).toISOString(),
    activity: "Walking",
    detection: "Normal Pattern",
    confidence: 12,
    severity: "Normal",
    response: "None",
    status: "Normal",
    signals: ["Cadence Rhythmic", "Vertical Angle Stable (8°)"],
    isSimulated: true
  },
  {
    id: "EVT-8919",
    patientId: "P-002",
    patientName: "Arthur Pendelton",
    timestamp: "Today, 09:40 AM",
    rawTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    activity: "Sudden Movement",
    detection: "Warning Triggered",
    confidence: 58,
    severity: "Medium",
    response: "False Alarm (Self-Cleared)",
    status: "Safe",
    signals: ["Quick Stumble", "Recovered Balance within 1.2s"],
    isSimulated: true
  },
  {
    id: "EVT-8918",
    patientId: "P-003",
    patientName: "Clara Oswald",
    timestamp: "Today, 08:30 AM",
    rawTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    activity: "Sitting",
    detection: "Rest State",
    confidence: 5,
    severity: "Normal",
    response: "None",
    status: "Normal",
    signals: ["Angle 22° in Chair", "Zero Velocity"],
    isSimulated: true
  },
  {
    id: "EVT-8917",
    patientId: "P-001",
    patientName: "Eleanor Vance",
    timestamp: "Yesterday, 07:12 PM",
    rawTime: new Date(Date.now() - 3600000 * 18).toISOString(),
    activity: "Fall",
    detection: "Fall Detected",
    confidence: 91,
    severity: "High",
    response: "User Confirmed Safe",
    status: "False Alarm",
    signals: ["Bed Drop (Thump)", "User Cancelled Within 6s"],
    isSimulated: true
  },
  {
    id: "EVT-8916",
    patientId: "P-004",
    patientName: "Robert Martinez",
    timestamp: "Yesterday, 02:45 PM",
    rawTime: new Date(Date.now() - 3600000 * 22).toISOString(),
    activity: "Walking",
    detection: "Normal Pattern",
    confidence: 9,
    severity: "Normal",
    response: "None",
    status: "Normal",
    signals: ["Steady Pace (1.1 m/s)", "Normal Gait"],
    isSimulated: true
  }
];

export const INITIAL_ANALYTICS_DAYS = [
  { day: "Mon", falls: 0, warnings: 1, normal: 42, alerts: 0, falseAlarms: 1 },
  { day: "Tue", falls: 1, warnings: 2, normal: 38, alerts: 1, falseAlarms: 0 },
  { day: "Wed", falls: 0, warnings: 0, normal: 45, alerts: 0, falseAlarms: 0 },
  { day: "Thu", falls: 1, warnings: 3, normal: 36, alerts: 0, falseAlarms: 1 },
  { day: "Fri", falls: 0, warnings: 1, normal: 40, alerts: 0, falseAlarms: 0 },
  { day: "Sat", falls: 2, warnings: 2, normal: 32, alerts: 1, falseAlarms: 1 },
  { day: "Sun (Today)", falls: 1, warnings: 1, normal: 28, alerts: 1, falseAlarms: 1 },
];

export const SCENARIO_PRESETS = {
  NORMAL: {
    name: "Normal Activity",
    activityLabel: "NORMAL",
    status: "SAFE",
    statusColor: "emerald",
    acceleration: 9.8,
    velocity: 0.2,
    bodyAngle: 6,
    movement: "Normal",
    impact: "Low",
    fallConfidence: 4,
    severity: "Normal",
    gyroscope: { x: 0.1, y: 0.2, z: -0.1 },
    description: "Subject resting or standing naturally. Gravitational vector aligned vertically."
  },
  WALKING: {
    name: "Walking",
    activityLabel: "WALKING",
    status: "SAFE",
    statusColor: "emerald",
    acceleration: 11.2,
    velocity: 1.3,
    bodyAngle: 12,
    movement: "Moderate (Rhythmic)",
    impact: "Low",
    fallConfidence: 11,
    severity: "Normal",
    gyroscope: { x: 1.4, y: -0.8, z: 2.1 },
    description: "Dynamic periodic oscillation consistent with natural human bipedal cadence."
  },
  SITTING: {
    name: "Sitting Down",
    activityLabel: "SITTING",
    status: "SAFE",
    statusColor: "blue",
    acceleration: 9.9,
    velocity: 0.1,
    bodyAngle: 28,
    movement: "Low",
    impact: "Low",
    fallConfidence: 7,
    severity: "Normal",
    gyroscope: { x: 0.3, y: 0.1, z: 0.0 },
    description: "Controlled descent into seated posture. Gentle decel phase without sudden impact spikes."
  },
  SUDDEN_MOVEMENT: {
    name: "Sudden Movement / Stumble",
    activityLabel: "SUDDEN MOVEMENT",
    status: "WARNING",
    statusColor: "amber",
    acceleration: 15.8,
    velocity: 2.2,
    bodyAngle: 38,
    movement: "High / Irregular",
    impact: "Moderate",
    fallConfidence: 54,
    severity: "Medium",
    gyroscope: { x: 4.8, y: -3.2, z: 5.6 },
    description: "Abrupt jerk or rapid postural compensation detected. Fall threshold not fully breached."
  },
  FALL: {
    name: "Fall Simulation",
    activityLabel: "FALL DETECTED",
    status: "FALL DETECTED",
    statusColor: "red",
    acceleration: 24.8,
    velocity: 3.8,
    bodyAngle: 82,
    movement: "Zero Post-Impact",
    impact: "Critical (High)",
    fallConfidence: 94,
    severity: "HIGH",
    gyroscope: { x: 12.4, y: 9.8, z: -14.2 },
    description: "Rapid free-fall descent, high-g contact impact, horizontal orientation, and cessation of movement."
  },
  NO_MOVEMENT: {
    name: "Prolonged Inactivity",
    activityLabel: "NO MOVEMENT",
    status: "WARNING",
    statusColor: "amber",
    acceleration: 9.8,
    velocity: 0.0,
    bodyAngle: 75,
    movement: "None (Zero Motion)",
    impact: "Low",
    fallConfidence: 68,
    severity: "Medium",
    gyroscope: { x: 0.0, y: 0.0, z: 0.0 },
    description: "Subject stationary in an abnormal resting tilt for an extended observation period."
  }
};
