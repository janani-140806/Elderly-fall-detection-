# SafeFall AI – Intelligent Fall Detection and Emergency Response System

> **ACADEMIC & PROTOTYPE TRANSPARENCY NOTICE:**  
> **This project is a software prototype of a proposed hardware-assisted fall detection system. Sensor inputs and emergency responses are simulated for demonstration and software verification purposes. No physical wearable sensors, medical diagnostics, or live cellular emergency dispatches are currently connected.**

---

## 1. Project Title
**SafeFall AI – Intelligent Fall Detection and Emergency Response System**  
*A multimodal healthcare IoT and explainable AI software prototype for elderly care and patient safeguarding.*

---

## 2. Problem Statement
Falls among elderly individuals, post-surgery patients, and residents with reduced mobility are a primary cause of accidental injury, hospitalization, and loss of independence worldwide. 
- According to the World Health Organization (WHO), falls are the second leading cause of unintentional injury deaths globally.
- In many cases, fallen individuals suffer from the **"long lie"** phenomenon—remaining incapacitated on the floor for hours or days because they cannot reach a telephone or trigger a panic button.
- Existing wearable panic pendants require manual user activation, which fails if the subject loses consciousness, experiences head trauma, or is in shock.
- Conversely, many automated wearable detectors suffer from high false-alarm rates (e.g., dropping the device on a bed, brisk sitting, or rapid arm movement), leading users to disable or abandon them.

---

## 3. Existing Approaches & Limitations
| Approach | Mechanism | Limitations |
| :--- | :--- | :--- |
| **Manual Medical Alert Pendants** | Mechanical push-button | Useless if user is unconscious, injured, or out of reach. |
| **Simple Accelerometer Thresholds** | Single-axis impact detection | High rate of false alarms from sitting down hard or dropping the sensor. |
| **Fixed Surveillance Cameras** | Room optical cameras | Severe privacy infringement in bedrooms/bathrooms, high blindness from occlusions. |
| **Smartphone Fall Detectors** | Mobile phone internal gyro | Phones are frequently left on tables, charged overnight, or lost in cushions. |

---

## 4. Proposed Approach: SafeFall AI
SafeFall AI presents an intelligent, dual-stage safeguarding architecture:
1. **Explainable Multi-Signal Fall Logic**: Evaluates a combination of four physical indicators (Freefall transition + High contact impact spike + Rapid body orientation change to horizontal + Post-impact immobility) rather than relying on an isolated impact spike.
2. **False-Alarm Mitigation Window**: An automated 10-second interactive verification countdown modal ("Are you okay?"). If the subject is conscious and unhurt, clicking *"I'm OK"* clears the alert and logs a false alarm. If the timer expires or the user requests help, the system escalates autonomously.
3. **Simulated Autonomous Escalation**: Dispatches multi-channel simulated notifications including caregiver push alerts, automated cellular SMS, simulated phone dialer, high-decibel local buzzer siren (via Web Audio API), and GPS location sharing.
4. **Interactive Software Prototype & Simulator**: Allows educators, students, and engineers to rigorously test edge cases (walking gait, sitting down, sudden stumble, full collapse, prolonged immobility) without requiring physical hardware fabrication during preliminary verification.

### Architectural Clarification: Motion Sensor (Hardware) vs. Camera (Demonstration Only)
> [!IMPORTANT]
> **Actual Proposed Hardware**: Designed strictly around wearable motion sensors (**MPU-6050 6-DoF IMU** + ESP32 microcontroller).
> **Laptop Camera Demo**: Used **exclusively as a software demonstration layer** so evaluators can visually observe simulated fall events during presentations. The camera is **never** presented as part of the physical hardware implementation.

---

## 5. System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                           PHYSICAL SENSORS (FUTURE)                               |
|   +--------------------------+           +------------------------------------+   |
|   |   MPU-6050 3-Axis Accel  |           |     MPU-6050 3-Axis Gyroscope      |   |
|   +-------------+------------+           +-----------------+------------------+   |
|                 \                                          /                      |
|                  +--------------------+-------------------+                       |
|                                       |                                           |
|                                       v                                           |
|                   +---------------------------------------+                       |
|                   |        ESP32 Microcontroller          |                       |
|                   |  - 50Hz Sampling Rate                 |                       |
|                   |  - Vector Magnitude Calculation       |                       |
|                   +-------------------+-------------------+                       |
|                                       |                                           |
|                                       v (Wi-Fi / BLE / WebSockets)                |
+-----------------------------------------------------------------------------------+
                                        |
+---------------------------------------v-------------------------------------------+
|                       SAFEFALL AI SOFTWARE ENGINE                                 |
|                                                                                   |
|  [Stage 1: Input]       --> Raw Telemetry Ingestion (Simulated Stream)            |
|  [Stage 2: Processing]  --> Filter Noise & Calculate Angular Deviation            |
|  [Stage 3: Algorithm]   --> Evaluate 4 Multi-Parameter Rule Thresholds:           |
|                                1. High Impact Peak (>18.5 m/s²)                   |
|                                2. Sudden Free-fall Acceleration                   |
|                                3. Body Tilt Angle Shift (>60°)                    |
|                                4. Post-Impact Immobility / Velocity Cessation     |
|  [Stage 4: Confidence]  --> Weighted Consensus Score (0 - 100%)                   |
|  [Stage 5: Severity]    --> Severity Classification (Normal / Med / HIGH)         |
|  [Stage 6: Verify]      --> 10s False-Alarm Countdown Modal ("Are you okay?")     |
|  [Stage 7: Dispatch]    --> Simulated Emergency Response Protocol:                |
|                                - Caregiver Push Alert Simulated                   |
|                                - SMS Dispatch Simulated                           |
|                                - Web Audio Synthesizer 90dB Buzzer                |
|                                - Simulated GPS Coordinates Broadcast              |
|  [Stage 8: Storage]     --> Persistent Audit Trail (LocalStorage)                 |
|  [Stage 9: Analytics]   --> Incident Ratios, Response Latencies & Visual Charts   |
+-----------------------------------------------------------------------------------+
```

---

## 6. Technology Stack
- **Frontend Framework**: React 18 (Functional components with custom Hooks)
- **Tooling & Build System**: Vite 6 (Fast HMR & optimized production bundling)
- **Styling & Design System**: Tailwind CSS (Custom dark healthcare dashboard styling, glassmorphism, responsive grids)
- **Icons**: Lucide React
- **Audio Synthesis**: Native Web Audio API (Synthesizes multi-tone emergency buzzer and chime sounds without external audio assets)
- **Graphics & Visualization**: 
  - Canvas 2D Animated Synthetic Human Pose Skeleton (30 FPS synthetic vision feed)
  - Custom Responsive SVG Waveform Monitors (ECG/telemetry style real-time line charts)
  - Responsive SVG Grouped Bar Charts, Donut Charts, and Latency Curve Visualizers
- **Data Persistence**: HTML5 `localStorage` (Preserves settings, audit history, and incident logs across browser reloads)

---

## 7. Key Features
1. **Interactive Simulation Control Lab**:
   - `[Normal Activity]`: Demonstrates baseline gravity (9.8 m/s²) and vertical alignment.
   - `[Walking]`: Simulates rhythmic human gait oscillations.
   - `[Sitting]`: Demonstrates controlled descent into a chair (28° tilt) without triggering fall alarms.
   - `[Sudden Movement]`: Simulates a stumble or jerk, entering a `WARNING` state without false alarming.
   - `[Fall Simulation]`: Executes an authentic 6-stage animated collapse sequence leading to 94% fall confidence and automatic escalation.
   - `[No Movement]`: Detects prolonged horizontal inactivity (180s+) and prompts for verification.
2. **Explainable AI Algorithm Panel**: Real-time signal breakdown displaying exact threshold breaches.
3. **10-Second False-Alarm Verification System**: Circular animated progress countdown allowing the user to click *"I'm OK"* to cancel alerts.
4. **Emergency Console with Simulated Dispatch**: Displays simulated SMS messages, simulated outbound caregiver phone dialer, audible buzzer siren, and location map.
5. **Simulated GPS & Geolocation**: Interactive radar map showing coordinate lock, geofence status, and satellite acquisition.
6. **Persistent Audit History**: Searchable, filterable event table with CSV export capability.
7. **Healthcare Analytics Dashboard**: 7-day incident distribution bar charts, activity breakdown donut chart, and response latency SLA tracking.
8. **Automated College Demo Mode**: Single-click 2-minute automated presentation walkthrough (`[START DEMO]`) cycling through all 8 stages automatically.

---

## 8. Fall Detection Logic & Rules
The prototype implements an explainable rule-based decision engine:

$$\text{Fall Probability} = w_1 \cdot I_{\text{impact}} + w_2 \cdot I_{\text{accel}} + w_3 \cdot I_{\text{angle}} + w_4 \cdot I_{\text{immobility}}$$

Where:
- **Condition 1 (Impact)**: Deceleration magnitude peak exceeds threshold ($a > 18.5\text{ m/s}^2$).
- **Condition 2 (Acceleration)**: Freefall transition rate exceeds calibrated differential delta.
- **Condition 3 (Posture Angle)**: Deviation of gravitational vector from vertical exceeds posture threshold ($\theta > 60^\circ$).
- **Condition 4 (Immobility)**: Variance of movement following impact drops to zero ($v < 0.1\text{ m/s}$).

When all 4 conditions are satisfied:
- **Consensus**: `FALL DETECTED`
- **Confidence**: `94%`
- **Severity**: `HIGH`
- **Action**: Escalates immediately to the 10-second verification countdown.

---

## 9. College Presentation Demo Instructions

### Quick Automated Tour (2–3 Minutes)
1. Launch the web application and click **[START DEMO]** in the top demo banner.
2. The system will automatically guide you through all 8 stages:
   - Stage 1: Baseline monitoring (Dashboard)
   - Stage 2: Walking gait telemetry (Monitoring feed)
   - Stage 3: Sudden stumble / warning state
   - Stage 4: 6-stage animated fall sequence (Simulation lab)
   - Stage 5: 10-second false-alarm countdown
   - Stage 6: Emergency response & caregiver dispatch
   - Stage 7: Event history verification
   - Stage 8: Completed analytics review

### Step-by-Step Manual Demonstration Scenario
1. **Open Dashboard**: Note the system status `● ACTIVE` and 5 KPI cards.
2. **Navigate to "Live Monitoring"**: Observe the animated 2D stick-figure avatar standing upright and real-time telemetry waveforms.
3. **Navigate to "Fall Simulation"**:
   - Click `[Walking]` → Avatar walks; sensor values oscillate normally.
   - Click `[Sitting]` → Avatar sits; angle transitions to 28°; status remains `SAFE`.
   - Click `[Sudden Movement]` → Avatar tilts; status shifts to `WARNING`.
   - Click `[Fall Simulation]` → Watch the 6-stage timeline execute:
     1. *Monitoring movement...*
     2. *Sudden acceleration detected...*
     3. *Abnormal body orientation detected...*
     4. *High impact detected...*
     5. *Movement stopped...*
     6. *Analyzing...*
4. **Verification Modal**: The modal appears with *"Are you okay?"* and a 10-second countdown.
5. **Click "Send Emergency Alert"** (or let the countdown reach zero).
6. **Emergency Response Screen**:
   - Observe the 5 simulated dispatches: Event logged, Caregiver notified, SMS simulated, Buzzer sounding, and Location shared.
   - Click `[Call Caregiver (Simulated)]` to show the outbound phone call simulation modal.
7. **Navigate to "Event History"**: Observe the new fall event logged at the top of the table.
8. **Navigate to "Analytics"**: Verify that the daily chart and total incident counters have updated.

---

## 10. Future Hardware Integration Plan

| Component | Hardware Specification | Proposed Function |
| :--- | :--- | :--- |
| **Microcontroller** | ESP-32 WROOM-32 (Dual-core 240MHz) | Edge processing, I2C master, Wi-Fi / BLE transmission. |
| **Motion Sensor** | MPU-6050 6-DoF IMU | 3-axis accelerometer ($\pm 16g$) + 3-axis gyro ($\pm 2000^\circ/\text{s}$). |
| **GPS Module** | u-blox NEO-6M | High-sensitivity satellite positioning with outdoor geofencing. |
| **Cellular Modem**| SIM800L Quad-band GSM/GPRS | Autonomous fallback SMS and synthesized voice dialer. |
| **Audible Siren**  | Active Piezo Buzzer | 90dB local alert at 2.3 kHz for immediate nearby assistance. |
| **Battery Unit**  | 1200mAh Li-Po + TP4056 BMS | Wearable pendant form-factor with 48-hour continuous battery life. |

### Proposed Hardware Pinout
- **MPU-6050 SDA**: ESP32 GPIO 21
- **MPU-6050 SCL**: ESP32 GPIO 22
- **NEO-6M GPS TX/RX**: ESP32 GPIO 16 / 17 (UART2)
- **SIM800L TX/RX**: ESP32 GPIO 4 / 2 (UART1)
- **Piezo Buzzer**: ESP32 GPIO 25 (PWM control)

---

## 11. Limitations & Future Enhancements
### Current Prototype Limitations
- Sensor telemetry and GPS locations are generated synthetically via JavaScript models.
- Caregiver notifications and SMS dispatches are simulated within the user interface.
- Audio sirens rely on the browser's Web Audio API rather than a physical piezo transducer.

### Future Enhancements
- Fabrication of a 3D-printed wearable lanyard/belt-clip housing.
- Integration of a physical ESP32 microcontroller with WebSockets for true real-time streaming.
- Implementation of an on-device TinyML / Edge Impulse neural network running directly on the ESP32.
- Integration with Twilio API or AWS SNS for real-world cellular SMS and WhatsApp alerts.

---

## 12. Local Setup & Running Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run the local development server
npm run dev

# 3. Open browser at:
http://localhost:3000

# 4. To build for production distribution
npm run build
```

---

## 13. Academic Integrity & Transparency Statement
> **SafeFall AI** was created as an educational prototype to demonstrate healthcare IoT architecture, explainable fall detection algorithms, and false-alarm mitigation workflows. All sensor readings, GPS coordinates, phone calls, and text messages rendered within this software application are strictly simulated for academic evaluation.
