// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav links
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
}

function scrollToSection(sectionId) {
    showSection(sectionId);
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// File Upload Handling
const resumeFile = document.getElementById('resume-file');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const uploadBox = document.querySelector('.upload-box');

resumeFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            alert('Only PDF and DOCX files are supported');
            return;
        }
        
        fileName.textContent = `✓ Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        fileInfo.style.display = 'block';
    }
});

// Drag and drop
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.backgroundColor = '#f0f4ff';
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.backgroundColor = '';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.backgroundColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        resumeFile.files = files;
        const event = new Event('change', { bubbles: true });
        resumeFile.dispatchEvent(event);
    }
});

// Upload Resume
async function uploadResume() {
    const file = resumeFile.files[0];
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const uploadStatus = document.getElementById('upload-status');
    uploadStatus.innerHTML = '<p>Uploading...</p>';
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}/resume/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        
        uploadStatus.innerHTML = `<p style="color: green;">✓ Resume uploaded successfully! (ID: ${data.resume_id})</p>`;
        resumeId = data.resume_id;
        localStorage.setItem('resumeId', resumeId);
        
        setTimeout(() => showSection('dashboard'), 2000);
    } catch (error) {
        uploadStatus.innerHTML = `<p style="color: red;">✗ Upload failed: ${error.message}</p>`;
    }
}

// Match Threshold Slider
const thresholdSlider = document.getElementById('match-threshold');
const thresholdDisplay = document.getElementById('threshold-display');

thresholdSlider.addEventListener('input', () => {
    thresholdDisplay.textContent = thresholdSlider.value + '%';
});

// Save Settings
function saveSettings() {
    const threshold = thresholdSlider.value;
    const autoApply = document.getElementById('auto-apply-toggle').checked;
    
    const settings = {
        threshold,
        autoApply
    };
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
}

// Load sample data
function loadDashboardData() {
    document.getElementById('total-apps').textContent = '25';
    document.getElementById('applied-apps').textContent = '12';
    document.getElementById('pending-apps').textContent = '8';
    document.getElementById('success-rate').textContent = '48%';
    
    const tbody = document.getElementById('apps-tbody');
    tbody.innerHTML = `
        <tr>
            <td>Senior Backend Engineer</td>
            <td>Tech Corp</td>
            <td>85.5%</td>
            <td>Applied</td>
            <td>2024-02-19</td>
        </tr>
        <tr>
            <td>Full Stack Developer</td>
            <td>StartUp Inc</td>
            <td>72.3%</td>
            <td>Pending</td>
            <td>2024-02-19</td>
        </tr>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    loadDashboardData();
    
    // Load saved settings
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        thresholdSlider.value = settings.threshold;
        thresholdDisplay.textContent = settings.threshold + '%';
        document.getElementById('auto-apply-toggle').checked = settings.autoApply;
    }
});

console.log('AI Job Auto-Apply - Frontend Initialized');
console.log('API Base URL:', API_BASE_URL);
