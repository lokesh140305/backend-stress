const axios = require('axios');

// Function to classify stress level based on BPM, GSR, ECG, and EEG
function classifyStress(bpm, gsr, ecg, eeg) {
    let bpmStress, gsrStress, ecgStress, eegStress;

    // BPM: Low (< 60), Moderate (60-100), High (> 100)
    if (bpm < 60) {
        bpmStress = 0;  // No stress
    } else if (bpm >= 60 && bpm <= 100) {
        bpmStress = 1;  // Mild stress
    } else {
        bpmStress = 2;  // High stress
    }

    // GSR: Low (< 300), Moderate (300-700), High (> 700)
    if (gsr < 300) {
        gsrStress = 0;  // No stress
    } else if (gsr >= 300 && gsr <= 700) {
        gsrStress = 1;  // Mild stress
    } else {
        gsrStress = 2;  // High stress
    }

    // ECG: Low (< 300), Moderate (300-700), High (> 700)
    if (ecg < 300) {
        ecgStress = 0;  // No stress
    } else if (ecg >= 300 && ecg <= 700) {
        ecgStress = 1;  // Mild stress
    } else {
        ecgStress = 2;  // High stress
    }

    // EEG: Low (< 300), Moderate (300-700), High (> 700)
    if (eeg < 300) {
        eegStress = 0;  // No stress
    } else if (eeg >= 300 && eeg <= 700) {
        eegStress = 1;  // Mild stress
    } else {
        eegStress = 2;  // High stress
    }

    // Total stress level
    const totalStress = bpmStress + gsrStress + ecgStress + eegStress;

    // Classify stress based on total score
    if (totalStress === 0) {
        return 0;  // No stress
    } else if (totalStress === 1 || totalStress === 2) {
        return 1;  // Mild stress
    } else if (totalStress === 3 || totalStress === 4) {
        return 1;  // Moderate stress
    } else {
        return 2;  // High stress
    }
}

// This is the serverless function that Vercel will deploy
module.exports = async (req, res) => {
    // Add CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const bpmResponse = await axios.get('https://blr1.blynk.cloud/external/api/get?token=m8h5qpc75E6CtgeFv6BCYpof-3y_fg29&v0=');
        const bpm = parseInt(bpmResponse.data, 10);

        const eegResponse = await axios.get('https://blr1.blynk.cloud/external/api/get?token=m8h5qpc75E6CtgeFv6BCYpof-3y_fg29&v1=');
        const eeg = parseInt(eegResponse.data, 10);

        const gsrResponse = await axios.get('https://blr1.blynk.cloud/external/api/get?token=m8h5qpc75E6CtgeFv6BCYpof-3y_fg29&v2=');
        const gsr = parseInt(gsrResponse.data, 10);

        const ecgResponse = await axios.get('https://blr1.blynk.cloud/external/api/get?token=m8h5qpc75E6CtgeFv6BCYpof-3y_fg29&v3=');
        const ecg = parseInt(ecgResponse.data, 10);

        // Classify the stress level
        const stressLevel = classifyStress(bpm, gsr, ecg, eeg);

        // Send the classified stress level as a response
        res.json({
            bpm,
            eeg,
            gsr,
            ecg,
            stress_level: stressLevel
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching or processing data');
    }
};
