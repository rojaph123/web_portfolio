// Firebase & Portfolio Integration
// Include this in your main index.html before other scripts

// Firebase Configuration (same as admin-config.js)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSaskP0fU3haf3BUdBD5b19CZF5vIm4pY",
  authDomain: "rov-portfolio.firebaseapp.com",
  projectId: "rov-portfolio",
  storageBucket: "rov-portfolio.firebasestorage.app",
  messagingSenderId: "159765368120",
  appId: "1:159765368120:web:f4a8221ad1dd732b5a45cd",
  measurementId: "G-KJHXVE5HW7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ===== LOAD PROFILE =====
function loadProfile() {
    // Load profile data (name, title, photo)
    db.collection('portfolio').limit(1).get().then(snapshot => {
        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            
            // Update hero title
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle && data.name) {
                heroTitle.textContent = data.name;
            }
            
            // Update hero subtitle
            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle && data.title) {
                heroSubtitle.textContent = data.title;
            }
            
            // Update profile photo
            const profilePhoto = document.querySelector('.profile-photo');
            if (profilePhoto && data.photo) {
                profilePhoto.src = data.photo;
                profilePhoto.alt = data.name || 'Profile Photo';
            }
            
            // Update document title
            if (data.name) {
                document.title = data.name + ' - IT Professional Portfolio';
            }
        }
    }).catch(error => console.error('Error loading profile:', error));
}

// ===== LOAD ABOUT SECTION =====
function loadAboutSection() {
    const aboutSection = document.querySelector('#about .about-content p:first-of-type');
    if (!aboutSection) return;

    // Get the first admin user (or just load all)
    db.collection('portfolio').limit(1).get().then(snapshot => {
        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            if (data.about) {
                aboutSection.textContent = data.about;
            }
        }
    });
}

// ===== LOAD EDUCATION =====
function loadEducationSection() {
    const educationTimeline = document.getElementById('educationTimeline');
    if (!educationTimeline) return;

    db.collection('education').limit(10).get().then(snapshot => {
        if (snapshot.empty) {
            educationTimeline.innerHTML = '<p style="text-align: center; color: #999;">No education entries yet.</p>';
            return;
        }

        // Convert to array and sort by date (newest first)
        const eduArray = [];
        snapshot.forEach(doc => {
            eduArray.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by createdAt descending (newest first)
        eduArray.sort((a, b) => {
            const timeA = a.createdAt?.toDate?.() || new Date(0);
            const timeB = b.createdAt?.toDate?.() || new Date(0);
            return timeA - timeB;
        });

        educationTimeline.innerHTML = '';
        eduArray.forEach((edu) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3>${edu.degree}</h3>
                    <p class="institution">${edu.institution} - ${edu.period}</p>
                    <p class="description">${edu.description}</p>
                </div>
            `;
            educationTimeline.appendChild(timelineItem);
        });
    });
}

// ===== LOAD EXPERIENCE =====
function loadExperienceSection() {
    const experienceContainer = document.getElementById('experienceCards');
    if (!experienceContainer) return;

    db.collection('experience').limit(10).get().then(snapshot => {
        if (snapshot.empty) {
            experienceContainer.innerHTML = '<p style="text-align: center; color: #999;">No experience entries yet.</p>';
            return;
        }

        // Convert to array and sort by date (newest first)
        const expArray = [];
        snapshot.forEach(doc => {
            expArray.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by createdAt descending (newest first)
        expArray.sort((a, b) => {
            const timeA = a.createdAt?.toDate?.() || new Date(0);
            const timeB = b.createdAt?.toDate?.() || new Date(0);
            return timeA - timeB;
        });

        experienceContainer.innerHTML = '';
        expArray.forEach(exp => {
            const expCard = document.createElement('div');
            expCard.className = 'experience-card';
            const dutiesHTML = exp.duties.map(duty => `<li>${duty}</li>`).join('');
            expCard.innerHTML = `
                <div class="exp-header">
                    <h3>${exp.position}</h3>
                    <span class="exp-date">${exp.period}</span>
                </div>
                <p class="exp-company">${exp.company}</p>
                <ul class="exp-duties">
                    ${dutiesHTML}
                </ul>
            `;
            experienceContainer.appendChild(expCard);
        });
    });
}

// ===== LOAD SKILLS =====
function loadSkillsSection() {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) return;

    db.collection('skills').limit(20).get().then(snapshot => {
        if (snapshot.empty) return;

        skillsList.innerHTML = '';
        snapshot.forEach(doc => {
            const skill = doc.data();
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            const iconClass = skill.icon || 'fas fa-check-circle';
            skillCard.innerHTML = `
                <i class="${iconClass}"></i>
                <h3>${skill.name}</h3>
            `;
            skillsList.appendChild(skillCard);
        });
    });
}

// ===== LOAD DYNAMIC PROJECTS =====
function loadDynamicProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    db.collection('projects')
        .where('featured', '==', true)
        .limit(6)
        .get()
        .then(snapshot => {
            const dynamicContainer = document.getElementById('dynamicProjects');
            
            if (snapshot.empty) {
                if (dynamicContainer) {
                    dynamicContainer.innerHTML = '<p style="text-align: center; color: #999;">No featured projects yet.</p>';
                }
                return;
            }

            // Convert to array and sort by date (newest first)
            const projectArray = [];
            snapshot.forEach(doc => {
                projectArray.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort by createdAt descending (newest first)
            projectArray.sort((a, b) => {
                const timeA = a.createdAt?.toDate?.() || new Date(0);
                const timeB = b.createdAt?.toDate?.() || new Date(0);
                return timeA - timeB;
            });

            let dynamicHTML = '';
            projectArray.forEach(project => {
                const iconClass = project.icon || 'fas fa-laptop-code';
                dynamicHTML += `
                    <div class="project-card">
                        <div class="project-image">
                            <i class="${iconClass}" style="color: #1e88e5;"></i>
                        </div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <a href="${project.link}" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
            });

            if (dynamicContainer) {
                dynamicContainer.innerHTML = dynamicHTML;
            }
        });
}

// ===== LOAD STUDENT WORKS =====
function loadStudentWorksSection() {
    const studentWorksList = document.getElementById('studentWorksList');
    if (!studentWorksList) return;

    Promise.all([
        db.collection('studentWorks').get(),
        db.collection('siteSettings').doc('studentWorks').get()
    ])
        .then(([snapshot, settingsDoc]) => {
            const firebaseWorks = [];
            snapshot.forEach(doc => firebaseWorks.push({ id: doc.id, ...doc.data() }));
            const managed = settingsDoc.exists && settingsDoc.data().managed;
            renderStudentWorks(managed ? firebaseWorks : (firebaseWorks.length ? firebaseWorks : (window.STUDENT_WORKS || [])));
        })
        .catch(() => {
            renderStudentWorks(window.STUDENT_WORKS || []);
        });
}

function getWorkDomain(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch (error) {
        return 'student work';
    }
}

function getWebsitePreviewImageUrl(url) {
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=900`;
}

function renderStudentWorks(works) {
    const studentWorksList = document.getElementById('studentWorksList');
    if (!studentWorksList) return;

    if (!works.length) {
        studentWorksList.innerHTML = '<p style="text-align: center; color: #999;">No student works listed yet.</p>';
        return;
    }

    works.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    studentWorksList.innerHTML = works.map(work => `
        <article class="student-work-card">
            <a href="${work.link}" target="_blank" rel="noopener" class="student-work-preview" aria-label="Preview ${work.name}">
                <div class="student-work-browser-preview">
                    <div class="browser-bar">
                        <span></span><span></span><span></span>
                        <em>${getWorkDomain(work.link)}</em>
                    </div>
                    <div class="browser-page">
                        <strong>${work.name}</strong>
                        <small>${work.category || 'Academic Output'}</small>
                        <div class="browser-lines">
                            <i></i><i></i><i></i>
                        </div>
                    </div>
                </div>
                <img
                    class="student-work-screenshot"
                    src="${getWebsitePreviewImageUrl(work.link)}"
                    alt="${work.name} website preview"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    onload="this.classList.add('is-loaded')"
                    onerror="this.remove()">
                <div class="student-work-preview-overlay">
                    <span><i class="fas fa-arrow-up-right-from-square"></i> Open Preview</span>
                </div>
            </a>
            <div class="student-work-meta">
                <span><i class="fas fa-user-graduate"></i> Student Project</span>
                <span>${work.category || 'Academic Output'}</span>
            </div>
            <h3>${work.name}</h3>
            <p>${work.description}</p>
            <a href="${work.link}" target="_blank" rel="noopener" class="student-work-link">
                Visit Work <i class="fas fa-arrow-up-right-from-square"></i>
            </a>
        </article>
    `).join('');
}

// ===== LOAD CERTIFICATES =====
function getSpreadsheetCertificates() {
    return (window.PORTFOLIO_CERTIFICATES || []).map((cert, index) => ({
        id: `spreadsheet-${index}`,
        ...cert,
        source: cert.source || 'assets/certs.xlsx'
    }));
}

function getCertificateKey(cert) {
    return `${cert.name || ''}|${cert.issuer || ''}|${cert.date || ''}`.toLowerCase();
}

function getCertificateCategory(cert) {
    if (cert.category) return cert.category;

    const name = (cert.name || '').toLowerCase();
    const issuer = (cert.issuer || '').toLowerCase();
    const text = `${name} ${issuer}`;

    if (text.includes('university of the philippines open university')) return 'UP Open University';
    if (text.includes('microsoft') || text.includes('azure')) return 'Microsoft & Azure';
    if (text.includes('cisco') || text.includes('oracle') || text.includes('aws')) return 'Technology Vendors';
    if (text.includes('sti')) return 'STI Faculty & Training';
    if (text.includes('bukidnon state university')) return 'BukSU Professional Development';
    if (text.includes('conference') || text.includes('lecture series') || text.includes('research')) return 'Academic Conferences';
    if (text.includes('faculty certification') || text.includes('teaching') || text.includes('educator')) return 'Teaching & Faculty Development';
    if (text.includes('ai') || text.includes('data') || text.includes('analytics') || text.includes('programming')) return 'Technology & Data';

    return 'Professional Development';
}

function getCertificateCategoryIcon(category) {
    const icons = {
        'UP Open University': 'fas fa-university',
        'Microsoft & Azure': 'fab fa-microsoft',
        'Technology Vendors': 'fas fa-cloud',
        'STI Faculty & Training': 'fas fa-chalkboard-user',
        'BukSU Professional Development': 'fas fa-school',
        'Academic Conferences': 'fas fa-users',
        'Teaching & Faculty Development': 'fas fa-graduation-cap',
        'Technology & Data': 'fas fa-microchip',
        'Professional Development': 'fas fa-award'
    };

    return icons[category] || 'fas fa-award';
}

function shouldRotateCertificatePreview(cert) {
    return getCertificateCategory(cert) === 'Microsoft & Azure';
}

function mergeCertificates(firebaseCertificates) {
    const certificates = [];
    const seen = new Set();

    [...firebaseCertificates, ...getSpreadsheetCertificates()].forEach(cert => {
        const key = getCertificateKey(cert);
        if (!key.trim() || seen.has(key)) return;
        seen.add(key);
        certificates.push(cert);
    });

    return certificates.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function getDrivePreviewUrl(url) {
    const match = (url || '').match(/drive\.google\.com\/file\/d\/([^/]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

function getDriveThumbnailUrl(url) {
    const match = (url || '').match(/drive\.google\.com\/file\/d\/([^/]+)/);
    return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000` : url;
}

function renderCertificates(certArray) {
    const certificatesGrid = document.getElementById('certificatesList');
    if (!certificatesGrid) return;

    if (!certArray.length) {
        certificatesGrid.innerHTML = '<p style="text-align: center; color: #999;">No certificates yet.</p>';
        return;
    }

    const groupedCertificates = certArray.reduce((groups, cert) => {
        const category = getCertificateCategory(cert);
        groups[category] = groups[category] || [];
        groups[category].push(cert);
        return groups;
    }, {});

    certificatesGrid.innerHTML = Object.entries(groupedCertificates).map(([category, certificates]) => `
        <div class="cert-category-group">
            <div class="cert-category-heading">
                <span><i class="${getCertificateCategoryIcon(category)}"></i> ${category}</span>
                <small>${certificates.length} ${certificates.length === 1 ? 'certificate' : 'certificates'}</small>
            </div>
            <div class="cert-category-grid">
                ${certificates.map(cert => {
                    const dateObj = new Date(cert.date);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    const thumbnailUrl = getDriveThumbnailUrl(cert.fileUrl);
                    const rotateClass = shouldRotateCertificatePreview(cert) ? ' rotate-clockwise' : '';
                    return `
                        <div class="cert-card" onclick="viewCertificatePreview('${cert.id}')">
                            <div class="cert-card-preview${rotateClass}">
                                <img src="${thumbnailUrl}" alt="${cert.name} certificate preview" loading="lazy" onerror="this.closest('.cert-card-preview').classList.add('preview-unavailable'); this.remove();">
                                <div class="cert-preview-fallback">
                                    <div class="cert-preview-ribbon"><i class="fas fa-certificate"></i></div>
                                    <strong>${cert.name}</strong>
                                    <span>${cert.issuer}</span>
                                </div>
                                <div class="cert-card-preview-overlay">
                                    <span><i class="fas fa-expand"></i> Preview</span>
                                </div>
                            </div>
                            <div class="cert-header">
                                <i class="fas fa-certificate"></i>
                                <h3>${cert.name}</h3>
                            </div>
                            <div class="cert-category-badge">
                                <i class="${getCertificateCategoryIcon(getCertificateCategory(cert))}"></i> ${getCertificateCategory(cert)}
                            </div>
                            <p class="cert-issuer"><strong>Issued By:</strong> ${cert.issuer}</p>
                            <p class="cert-date"><strong>Date:</strong> ${formattedDate}</p>
                            <p class="cert-hours"><strong>Hours:</strong> ${cert.hours}h</p>
                            <div class="cert-preview-btn">
                                <i class="fas fa-eye"></i> View Certificate
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

function loadCertificatesSection() {
    const certificatesGrid = document.getElementById('certificatesList');
    if (!certificatesGrid) return;

    Promise.all([
        db.collection('certificates').orderBy('createdAt', 'desc').get(),
        db.collection('siteSettings').doc('certificates').get()
    ])
        .then(([snapshot, settingsDoc]) => {
            const firestoreCertificates = [];
            snapshot.forEach(doc => {
                firestoreCertificates.push({ id: doc.id, ...doc.data() });
            });
            const managed = settingsDoc.exists && settingsDoc.data().managed;
            renderCertificates(managed ? firestoreCertificates : mergeCertificates(firestoreCertificates));
        })
        .catch(() => {
            renderCertificates(getSpreadsheetCertificates());
        });
}

function viewCertificatePreview(certificateId) {
    if (certificateId.startsWith('spreadsheet-')) {
        const cert = getSpreadsheetCertificates().find(item => item.id === certificateId);
        if (cert) showCertificateModal(cert);
        return;
    }

    db.collection('certificates').doc(certificateId).get().then(doc => {
        if (doc.exists) {
            showCertificateModal(doc.data());
        }
    }).catch(error => {
        console.error('Error loading certificate:', error);
        alert('Error loading certificate preview');
    });
}

function showCertificateModal(cert) {
    const modal = document.createElement('div');
    const previewUrl = getDrivePreviewUrl(cert.fileUrl);
    const rotatePreview = shouldRotateCertificatePreview(cert);
    const pdfPreviewHTML = rotatePreview
        ? `<div style="height: 78vh; max-height: 860px; min-height: 560px; overflow: hidden; border-radius: 12px; border: 1px solid rgba(30, 136, 229, 0.3); background: white; display: flex; align-items: center; justify-content: center;">
                <iframe src="${previewUrl}" style="width: 78vh; max-width: 860px; height: min(96vw, 1160px); border: 0; background: white; transform: rotate(90deg); transform-origin: center center;" frameborder="0"></iframe>
           </div>`
        : `<iframe src="${previewUrl}" style="width: 100%; height: 78vh; max-height: 860px; border-radius: 12px; border: 1px solid rgba(30, 136, 229, 0.3); background: white;" frameborder="0"></iframe>`;
    modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            `;

    const dateObj = new Date(cert.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    modal.innerHTML = `
                <div style="background: linear-gradient(135deg, rgba(30, 136, 229, 0.15), rgba(30, 136, 229, 0.08)); border: 2px solid #1e88e5; border-radius: 16px; width: min(1280px, 96vw); max-height: 94vh; overflow-y: auto; padding: 32px; position: relative; box-shadow: 0 20px 60px rgba(30, 136, 229, 0.4); backdrop-filter: blur(10px);">
                    <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 20px; right: 20px; background: linear-gradient(135deg, #ff6b35, #ff5722); color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"><i class="fas fa-times"></i></button>
                    
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1e88e5; margin: 0 0 20px 0; font-size: 28px;"><i class="fas fa-certificate"></i> ${cert.name}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
                            <div style="background: rgba(30, 136, 229, 0.15); padding: 15px; border-radius: 8px; border-left: 4px solid #1e88e5;">
                                <p style="color: #999; margin: 0; font-size: 12px; text-transform: uppercase;">Issued By</p>
                                <p style="color: #e8eef7; margin: 5px 0 0 0; font-weight: 600;">${cert.issuer}</p>
                            </div>
                            <div style="background: rgba(30, 136, 229, 0.15); padding: 15px; border-radius: 8px; border-left: 4px solid #1e88e5;">
                                <p style="color: #999; margin: 0; font-size: 12px; text-transform: uppercase;">Category</p>
                                <p style="color: #e8eef7; margin: 5px 0 0 0; font-weight: 600;">${getCertificateCategory(cert)}</p>
                            </div>
                            <div style="background: rgba(30, 136, 229, 0.15); padding: 15px; border-radius: 8px; border-left: 4px solid #1e88e5;">
                                <p style="color: #999; margin: 0; font-size: 12px; text-transform: uppercase;">Date Issued</p>
                                <p style="color: #e8eef7; margin: 5px 0 0 0; font-weight: 600;">${formattedDate}</p>
                            </div>
                            <div style="background: rgba(30, 136, 229, 0.15); padding: 15px; border-radius: 8px; border-left: 4px solid #1e88e5;">
                                <p style="color: #999; margin: 0; font-size: 12px; text-transform: uppercase;">Training Hours</p>
                                <p style="color: #e8eef7; margin: 5px 0 0 0; font-weight: 600;">${cert.hours} hours</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin: 30px 0; border-top: 1px solid rgba(30, 136, 229, 0.3); border-bottom: 1px solid rgba(30, 136, 229, 0.3); padding: 30px 0;">
                        <h3 style="color: #1e88e5; text-align: center; margin-top: 0;">Certificate Preview</h3>
                        ${cert.fileType === 'pdf' 
                            ? pdfPreviewHTML
                            : `<img src="${cert.fileUrl}" style="max-width: 100%; max-height: min(78vh, 860px); border-radius: 12px; border: 1px solid rgba(30, 136, 229, 0.3); display: block; margin: 0 auto;">`
                        }
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${cert.fileUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1e88e5, #0066cc); color: white; padding: 14px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(30, 136, 229, 0.4);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(30, 136, 229, 0.6)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(30, 136, 229, 0.4)'">
                            <i class="fas fa-download"></i> Download Certificate
                        </a>
                    </div>
                </div>
            `;

    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===== CONTACT FORM SUBMISSION =====
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date()
            };

            try {
                await db.collection('contacts').add(formData);
                
                const messageEl = document.getElementById('formMessage');
                messageEl.textContent = '✅ Message sent successfully! Thank you for contacting me.';
                messageEl.className = 'form-message success';
                messageEl.style.display = 'block';

                contactForm.reset();

                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 5000);
            } catch (error) {
                const messageEl = document.getElementById('formMessage');
                messageEl.textContent = '❌ Error sending message: ' + error.message;
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
            }
        });
    }

    // Load all portfolio data from Firestore
    loadAboutSection();
    loadEducationSection();
    loadExperienceSection();
    loadSkillsSection();
    loadDynamicProjects();
    loadStudentWorksSection();
    loadCertificatesSection();
});
