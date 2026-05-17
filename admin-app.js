// Admin Dashboard Functions

// ===== AUTH FUNCTIONS =====
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
}

function adminLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage('loginMessage', 'Please enter email and password', 'error');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            showDashboard();
            loadDashboardData();
        })
        .catch(error => {
            showMessage('loginMessage', error.message, 'error');
        });
}

function adminLogout() {
    auth.signOut()
        .then(() => {
            document.getElementById('loginSection').style.display = 'block';
            document.getElementById('dashboardSection').style.display = 'none';
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        });
}

// ===== IMAGE UPLOAD HELPERS =====
async function uploadProjectImage(file) {
    if (!file) return null;
    
    const timestamp = Date.now();
    const fileName = `projects/${timestamp}_${file.name}`;
    const storageRef = storage.ref(fileName);
    
    try {
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

function deleteProjectImage(imageUrl) {
    if (!imageUrl) return Promise.resolve();
    
    try {
        const imageRef = storage.refFromURL(imageUrl);
        return imageRef.delete();
    } catch (error) {
        console.error('Error deleting image:', error);
        return Promise.resolve();
    }
}

// ===== EDIT MODE MANAGEMENT =====
let editingMode = {};

function startEdit(type, docId) {
    editingMode.type = type;
    editingMode.docId = docId;
}

function cancelEdit() {
    editingMode = {};
}

// ===== DASHBOARD FUNCTIONS =====
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'contacts') {
        loadContacts();
    }
}

// ===== PROFILE FUNCTIONS =====
async function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    const title = document.getElementById('profileTitle').value.trim();
    const photoFile = document.getElementById('profilePhoto').files[0];

    if (!name || !title) {
        showAlert('Please fill in name and title', 'error');
        return;
    }

    try {
        let updateData = {
            name: name,
            title: title,
            userId: auth.currentUser.uid,
            updatedAt: new Date()
        };

        if (photoFile) {
            showAlert('Uploading photo...', 'success');
            const photoURL = await uploadProfilePhoto(photoFile);
            updateData.photo = photoURL;

            // Delete old photo
            const oldProfile = await db.collection('portfolio').doc(auth.currentUser.uid).get();
            if (oldProfile.exists && oldProfile.data().photo) {
                await deleteProfilePhoto(oldProfile.data().photo);
            }
        }

        db.collection('portfolio').doc(auth.currentUser.uid).set(updateData, { merge: true })
        .then(() => {
            showAlert('Profile updated!', 'success');
            loadProfile();
        })
        .catch(error => {
            showAlert('Error: ' + error.message, 'error');
        });
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

function loadProfile() {
    db.collection('portfolio').doc(auth.currentUser.uid).get()
    .then(doc => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('profileName').value = data.name || '';
            document.getElementById('profileTitle').value = data.title || '';
            if (data.photo) {
                document.getElementById('profilePhotoPreviewImg').src = data.photo;
                document.getElementById('profilePhotoPreviewImg').style.display = 'block';
            }
        }
    })
    .catch(error => console.error('Error loading profile:', error));
}

async function uploadProfilePhoto(file) {
    if (!file) return null;
    
    const timestamp = Date.now();
    const fileName = `profile/${timestamp}_${file.name}`;
    const storageRef = storage.ref(fileName);
    
    try {
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
}

function deleteProfilePhoto(photoUrl) {
    if (!photoUrl) return Promise.resolve();
    
    try {
        const photoRef = storage.refFromURL(photoUrl);
        return photoRef.delete();
    } catch (error) {
        console.error('Error deleting photo:', error);
        return Promise.resolve();
    }
}

// ===== ABOUT FUNCTIONS =====
function saveAbout() {
    const aboutText = document.getElementById('aboutText').value;

    if (!aboutText) {
        showAlert('Please enter some text', 'error');
        return;
    }

    db.collection('portfolio').doc(auth.currentUser.uid).set({
        about: aboutText,
        userId: auth.currentUser.uid,
        updatedAt: new Date()
    }, { merge: true })
    .then(() => {
        showAlert('About section saved!', 'success');
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function loadAbout() {
    db.collection('portfolio').doc(auth.currentUser.uid).get()
    .then(doc => {
        if (doc.exists && doc.data().about) {
            document.getElementById('aboutText').value = doc.data().about;
        }
    })
    .catch(error => console.error('Error loading about:', error));
}

// ===== EDUCATION FUNCTIONS =====
function addEducation() {
    const degree = document.getElementById('eduDegree').value;
    const institution = document.getElementById('eduInstitution').value;
    const period = document.getElementById('eduPeriod').value;
    const description = document.getElementById('eduDescription').value;

    if (!degree || !institution || !period) {
        showAlert('Please fill all required fields', 'error');
        return;
    }

    db.collection('education').add({
        degree: degree,
        institution: institution,
        period: period,
        description: description,
        userId: auth.currentUser.uid,
        createdAt: new Date()
    })
    .then(() => {
        showAlert('Education added!', 'success');
        document.getElementById('eduDegree').value = '';
        document.getElementById('eduInstitution').value = '';
        document.getElementById('eduPeriod').value = '';
        document.getElementById('eduDescription').value = '';
        loadEducation();
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function loadEducation() {
    const eduList = document.getElementById('educationList');
    eduList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    db.collection('education')
        .where('userId', '==', auth.currentUser.uid)
        .onSnapshot(snapshot => {
            eduList.innerHTML = '';

            if (snapshot.empty) {
                eduList.innerHTML = '<div class="empty-state"><p><i class="fas fa-inbox"></i> No education entries yet.</p></div>';
                return;
            }

            snapshot.forEach(doc => {
                const edu = doc.data();
                const eduEl = document.createElement('div');
                eduEl.className = 'project-item';
                eduEl.innerHTML = `
                    <h4>${edu.degree}</h4>
                    <p><strong>${edu.institution}</strong> | ${edu.period}</p>
                    <p>${edu.description}</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-primary-custom" onclick="editEducation('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-danger-custom" onclick="deleteEducation('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
                eduList.appendChild(eduEl);
            });
        });
}

function editEducation(eduId) {
    db.collection('education').doc(eduId).get().then(doc => {
        if (doc.exists) {
            const edu = doc.data();
            document.getElementById('eduDegree').value = edu.degree;
            document.getElementById('eduInstitution').value = edu.institution;
            document.getElementById('eduPeriod').value = edu.period;
            document.getElementById('eduDescription').value = edu.description;

            const addBtn = document.querySelector('[onclick="addEducation()"]');
            addBtn.onclick = function() { updateEducation(eduId); };
            addBtn.innerHTML = '<i class="fas fa-save"></i> Update Education';
            addBtn.classList.add('edit-mode');
            
            // Scroll to form
            document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function updateEducation(eduId) {
    const degree = document.getElementById('eduDegree').value;
    const institution = document.getElementById('eduInstitution').value;
    const period = document.getElementById('eduPeriod').value;
    const description = document.getElementById('eduDescription').value;

    if (!degree || !institution || !period) {
        showAlert('Please fill all required fields', 'error');
        return;
    }

    db.collection('education').doc(eduId).update({
        degree: degree,
        institution: institution,
        period: period,
        description: description
    })
    .then(() => {
        showAlert('Education updated!', 'success');
        resetEducationForm();
        loadEducation();
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function resetEducationForm() {
    document.getElementById('eduDegree').value = '';
    document.getElementById('eduInstitution').value = '';
    document.getElementById('eduPeriod').value = '';
    document.getElementById('eduDescription').value = '';
    
    const addBtn = document.querySelector('[onclick*="updateEducation"]') || document.querySelector('[onclick="addEducation()"]');
    if (addBtn) {
        addBtn.onclick = function() { addEducation(); };
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Education';
        addBtn.classList.remove('edit-mode');
    }
}

function deleteEducation(eduId) {
    if (confirm('Delete this education entry?')) {
        db.collection('education').doc(eduId).delete()
            .then(() => {
                showAlert('Deleted!', 'success');
                loadEducation();
            })
            .catch(error => showAlert('Error: ' + error.message, 'error'));
    }
}

// ===== EXPERIENCE FUNCTIONS =====
function addExperience() {
    const position = document.getElementById('expPosition').value;
    const company = document.getElementById('expCompany').value;
    const period = document.getElementById('expPeriod').value;
    const dutiesText = document.getElementById('expDuties').value;

    if (!position || !company || !period || !dutiesText) {
        showAlert('Please fill all required fields', 'error');
        return;
    }

    const duties = dutiesText.split('\n').map(d => d.trim()).filter(d => d);

    db.collection('experience').add({
        position: position,
        company: company,
        period: period,
        duties: duties,
        userId: auth.currentUser.uid,
        createdAt: new Date()
    })
    .then(() => {
        showAlert('Experience added!', 'success');
        document.getElementById('expPosition').value = '';
        document.getElementById('expCompany').value = '';
        document.getElementById('expPeriod').value = '';
        document.getElementById('expDuties').value = '';
        loadExperience();
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function loadExperience() {
    const expList = document.getElementById('experienceList');
    expList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    db.collection('experience')
        .where('userId', '==', auth.currentUser.uid)
        .onSnapshot(snapshot => {
            expList.innerHTML = '';

            if (snapshot.empty) {
                expList.innerHTML = '<div class="empty-state"><p><i class="fas fa-inbox"></i> No experience entries yet.</p></div>';
                return;
            }

            snapshot.forEach(doc => {
                const exp = doc.data();
                const expEl = document.createElement('div');
                expEl.className = 'project-item';
                let dutiesHTML = exp.duties.map(d => `<li>${d}</li>`).join('');
                expEl.innerHTML = `
                    <h4>${exp.position}</h4>
                    <p><strong>${exp.company}</strong> | ${exp.period}</p>
                    <ul>${dutiesHTML}</ul>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-primary-custom" onclick="editExperience('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-danger-custom" onclick="deleteExperience('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
                expList.appendChild(expEl);
            });
        });
}

function editExperience(expId) {
    db.collection('experience').doc(expId).get().then(doc => {
        if (doc.exists) {
            const exp = doc.data();
            document.getElementById('expPosition').value = exp.position;
            document.getElementById('expCompany').value = exp.company;
            document.getElementById('expPeriod').value = exp.period;
            document.getElementById('expDuties').value = exp.duties.join('\n');

            const addBtn = document.querySelector('[onclick="addExperience()"]');
            addBtn.onclick = function() { updateExperience(expId); };
            addBtn.innerHTML = '<i class="fas fa-save"></i> Update Experience';
            addBtn.classList.add('edit-mode');
            
            // Scroll to form
            document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function updateExperience(expId) {
    const position = document.getElementById('expPosition').value;
    const company = document.getElementById('expCompany').value;
    const period = document.getElementById('expPeriod').value;
    const dutiesText = document.getElementById('expDuties').value;

    if (!position || !company || !period || !dutiesText) {
        showAlert('Please fill all required fields', 'error');
        return;
    }

    const duties = dutiesText.split('\n').map(d => d.trim()).filter(d => d);

    db.collection('experience').doc(expId).update({
        position: position,
        company: company,
        period: period,
        duties: duties
    })
    .then(() => {
        showAlert('Experience updated!', 'success');
        resetExperienceForm();
        loadExperience();
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function resetExperienceForm() {
    document.getElementById('expPosition').value = '';
    document.getElementById('expCompany').value = '';
    document.getElementById('expPeriod').value = '';
    document.getElementById('expDuties').value = '';
    
    const addBtn = document.querySelector('[onclick*="updateExperience"]') || document.querySelector('[onclick="addExperience()"]');
    if (addBtn) {
        addBtn.onclick = function() { addExperience(); };
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Experience';
        addBtn.classList.remove('edit-mode');
    }
}

function deleteExperience(expId) {
    if (confirm('Delete this experience entry?')) {
        db.collection('experience').doc(expId).delete()
            .then(() => {
                showAlert('Deleted!', 'success');
                loadExperience();
            })
            .catch(error => showAlert('Error: ' + error.message, 'error'));
    }
}

// ===== SKILLS FUNCTIONS =====
function addSkill() {
    const skill = document.getElementById('newSkill').value.trim();
    const skillIcon = document.getElementById('skillIcon').value || 'fas fa-code';

    if (!skill) {
        showAlert('Please enter a skill', 'error');
        return;
    }

    db.collection('skills').add({
        name: skill,
        icon: skillIcon,
        userId: auth.currentUser.uid,
        createdAt: new Date()
    })
    .then(() => {
        showAlert('Skill added!', 'success');
        document.getElementById('newSkill').value = '';
        document.getElementById('skillIcon').value = 'fas fa-code';
        document.getElementById('skillIconPreview').innerHTML = '<i class="fas fa-code"></i>';
        loadSkills();
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function loadSkills() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    db.collection('skills')
        .where('userId', '==', auth.currentUser.uid)
        .onSnapshot(snapshot => {
            skillsList.innerHTML = '';

            if (snapshot.empty) {
                skillsList.innerHTML = '<div class="empty-state"><p><i class="fas fa-inbox"></i> No skills yet.</p></div>';
                return;
            }

            snapshot.forEach(doc => {
                const skill = doc.data();
                const skillEl = document.createElement('div');
                skillEl.className = 'project-item';
                const iconHTML = skill.icon ? `<i class="${skill.icon}" style="font-size: 20px; margin-right: 10px; color: #1e88e5;"></i>` : '';
                skillEl.innerHTML = `
                    <p><strong>${iconHTML}${skill.name}</strong></p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-primary-custom" onclick="editSkill('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-danger-custom" onclick="deleteSkill('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
                skillsList.appendChild(skillEl);
            });
        });
}

function editSkill(skillId) {
    db.collection('skills').doc(skillId).get().then(doc => {
        if (doc.exists) {
            const skill = doc.data();
            document.getElementById('newSkill').value = skill.name;
            const skillIcon = skill.icon || 'fas fa-code';
            document.getElementById('skillIcon').value = skillIcon;
            document.getElementById('skillIconPreview').innerHTML = `<i class="${skillIcon}"></i>`;

            const addBtn = document.querySelector('[onclick="addSkill()"]');
            addBtn.onclick = function() { updateSkill(skillId); };
            addBtn.innerHTML = '<i class="fas fa-save"></i> Update Skill';
            addBtn.classList.add('edit-mode');
            
            // Scroll to form
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function updateSkill(skillId) {
    const skill = document.getElementById('newSkill').value.trim();
    const skillIcon = document.getElementById('skillIcon').value || 'fas fa-code';

    if (!skill) {
        showAlert('Please enter a skill', 'error');
        return;
    }

    db.collection('skills').doc(skillId).update({
        name: skill,
        icon: skillIcon
    })
    .then(() => {
        showAlert('Skill updated!', 'success');
        resetSkillForm();
        loadSkills();
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function resetSkillForm() {
    document.getElementById('newSkill').value = '';
    document.getElementById('skillIcon').value = 'fas fa-code';
    document.getElementById('skillIconPreview').innerHTML = '<i class="fas fa-code"></i>';
    
    const addBtn = document.querySelector('[onclick*="updateSkill"]') || document.querySelector('[onclick="addSkill()"]');
    if (addBtn) {
        addBtn.onclick = function() { addSkill(); };
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Skill';
        addBtn.classList.remove('edit-mode');
    }
}

function deleteSkill(skillId) {
    if (confirm('Delete this skill?')) {
        db.collection('skills').doc(skillId).delete()
            .then(() => {
                showAlert('Deleted!', 'success');
                loadSkills();
            })
            .catch(error => showAlert('Error: ' + error.message, 'error'));
    }
}

// ===== PROJECT FUNCTIONS =====
async function addProject() {
    const title = document.getElementById('projectTitle').value;
    const desc = document.getElementById('projectDesc').value;
    const link = document.getElementById('projectLink').value;
    const tags = document.getElementById('projectTags').value;
    const featured = document.getElementById('projectFeatured').checked;
    const projectIcon = document.getElementById('projectIcon').value || 'fas fa-laptop-code';
    const imageFile = document.getElementById('projectImage').files[0];

    if (!title || !desc || !link) {
        showAlert('Please fill all required fields', 'error');
        return;
    }

    try {
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
        let imageURL = null;

        if (imageFile) {
            showAlert('Uploading image...', 'success');
            imageURL = await uploadProjectImage(imageFile);
        }

        db.collection('projects').add({
            title: title,
            description: desc,
            link: link,
            tags: tagArray,
            featured: featured,
            icon: projectIcon,
            image: imageURL,
            createdAt: new Date(),
            userId: auth.currentUser.uid
        })
        .then(() => {
            showAlert('Project added successfully!', 'success');
            document.getElementById('projectTitle').value = '';
            document.getElementById('projectDesc').value = '';
            document.getElementById('projectLink').value = '';
            document.getElementById('projectTags').value = '';
            document.getElementById('projectFeatured').checked = false;
            document.getElementById('projectImage').value = '';
            document.getElementById('projectImagePreviewImg').style.display = 'none';
            document.getElementById('projectIcon').value = 'fas fa-laptop-code';
            document.getElementById('projectIconPreview').innerHTML = '<i class="fas fa-laptop-code"></i>';
            loadProjects();
        })
        .catch(error => {
            showAlert('Error: ' + error.message, 'error');
        });
    } catch (error) {
        showAlert('Error uploading image: ' + error.message, 'error');
    }
}

function loadProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    db.collection('projects')
        .where('userId', '==', auth.currentUser.uid)
        .onSnapshot(snapshot => {
            projectsList.innerHTML = '';

            if (snapshot.empty) {
                projectsList.innerHTML = '<div class="empty-state"><p><i class="fas fa-inbox"></i> No projects yet.</p></div>';
                return;
            }

            snapshot.forEach(doc => {
                const project = doc.data();
                const projectEl = document.createElement('div');
                projectEl.className = 'project-item';
                let imageHTML = '';
                if (project.image) {
                    imageHTML = `<img src="${project.image}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">`;
                }
                const iconHTML = project.icon ? `<i class="${project.icon}" style="font-size: 18px; margin-right: 8px; color: #1e88e5;"></i>` : '';
                projectEl.innerHTML = `
                    ${imageHTML}
                    <h4>
                        ${iconHTML}${project.title}
                        ${project.featured ? '<span style="color: #ffc107; margin-left: 10px;"><i class="fas fa-star"></i> Featured</span>' : ''}
                    </h4>
                    <p>${project.description}</p>
                    <p><strong>Link:</strong> <a href="${project.link}" target="_blank" style="color: #1e88e5;">${project.link}</a></p>
                    <div>
                        ${project.tags.map(tag => `<span style="display: inline-block; background: rgba(30, 136, 229, 0.3); padding: 4px 12px; border-radius: 12px; margin-right: 8px; font-size: 12px;">${tag}</span>`).join('')}
                    </div>
                    <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-primary-custom" onclick="editProject('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-primary-custom" style="background: ${project.featured ? '#ffc107' : 'rgba(255,193,7,0.3)'}; color: ${project.featured ? '#000' : '#ffc107'};" onclick="toggleFeatured('${doc.id}', ${!project.featured})">
                            <i class="fas fa-star"></i> ${project.featured ? 'Unstar' : 'Star'}
                        </button>
                        <button class="btn-danger-custom" onclick="deleteProject('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
                projectsList.appendChild(projectEl);
            });
        });
}

async function editProject(projectId) {
    db.collection('projects').doc(projectId).get().then(doc => {
        if (doc.exists) {
            const project = doc.data();
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDesc').value = project.description;
            document.getElementById('projectLink').value = project.link;
            document.getElementById('projectTags').value = project.tags.join(', ');
            document.getElementById('projectFeatured').checked = project.featured || false;
            
            const projectIcon = project.icon || 'fas fa-laptop-code';
            document.getElementById('projectIcon').value = projectIcon;
            document.getElementById('projectIconPreview').innerHTML = `<i class="${projectIcon}"></i>`;
            
            if (project.image) {
                document.getElementById('projectImagePreviewImg').src = project.image;
                document.getElementById('projectImagePreviewImg').style.display = 'block';
            }

            // Replace add button with update button
            const addBtn = document.querySelector('[onclick="addProject()"]');
            addBtn.onclick = function() { updateProject(projectId); };
            addBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';
            addBtn.classList.add('edit-mode');
        }
    });
}

async function updateProject(projectId) {
    const title = document.getElementById('projectTitle').value;
    const desc = document.getElementById('projectDesc').value;
    const link = document.getElementById('projectLink').value;
    const tags = document.getElementById('projectTags').value;
    const featured = document.getElementById('projectFeatured').checked;
    const projectIcon = document.getElementById('projectIcon').value || 'fas fa-laptop-code';
    const imageFile = document.getElementById('projectImage').files[0];

    if (!title || !desc || !link) {
        showAlert('Please fill all required fields', 'error');
        return;
    }

    try {
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
        let updateData = {
            title: title,
            description: desc,
            link: link,
            tags: tagArray,
            featured: featured,
            icon: projectIcon
        };

        if (imageFile) {
            showAlert('Uploading image...', 'success');
            const newImageURL = await uploadProjectImage(imageFile);
            updateData.image = newImageURL;

            // Delete old image
            const oldProject = await db.collection('projects').doc(projectId).get();
            if (oldProject.data().image) {
                await deleteProjectImage(oldProject.data().image);
            }
        }

        db.collection('projects').doc(projectId).update(updateData)
        .then(() => {
            showAlert('Project updated successfully!', 'success');
            resetProjectForm();
            loadProjects();
        })
        .catch(error => {
            showAlert('Error: ' + error.message, 'error');
        });
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

function resetProjectForm() {
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDesc').value = '';
    document.getElementById('projectLink').value = '';
    document.getElementById('projectTags').value = '';
    document.getElementById('projectFeatured').checked = false;
    document.getElementById('projectImage').value = '';
    document.getElementById('projectImagePreviewImg').style.display = 'none';
    document.getElementById('projectIcon').value = 'fas fa-laptop-code';
    document.getElementById('projectIconPreview').innerHTML = '<i class="fas fa-laptop-code"></i>';
    
    const addBtn = document.querySelector('[onclick*="updateProject"]') || document.querySelector('[onclick="addProject()"]');
    if (addBtn) {
        addBtn.onclick = function() { addProject(); };
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Project';
        addBtn.classList.remove('edit-mode');
    }
}

function toggleFeatured(projectId, featured) {
    db.collection('projects').doc(projectId).update({
        featured: featured
    })
    .then(() => {
        showAlert(featured ? 'Project starred!' : 'Project unstarred!', 'success');
        loadProjects();
    })
    .catch(error => {
        showAlert('Error: ' + error.message, 'error');
    });
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        db.collection('projects').doc(projectId).delete()
            .then(() => {
                showAlert('Project deleted!', 'success');
                loadProjects();
            })
            .catch(error => {
                showAlert('Error: ' + error.message, 'error');
            });
    }
}

function loadDashboardData() {
    loadProfile();
    loadAbout();
    loadEducation();
    loadExperience();
    loadSkills();
    loadProjects();
    loadStudentWorks();
    loadCertificates();
    loadContacts();
}

// ===== SUPERVISED STUDENT WORKS FUNCTIONS =====
function getSpreadsheetStudentWorks() {
    return (window.STUDENT_WORKS || []).map((work, index) => ({
        id: `spreadsheet-work-${index}`,
        ...work,
        source: 'assets/landing pages.xlsx'
    }));
}

function getStudentWorkKey(work) {
    return `${work.name || ''}|${work.link || ''}`.toLowerCase();
}

function resetStudentWorkForm() {
    document.getElementById('studentWorkName').value = '';
    document.getElementById('studentWorkDescription').value = '';
    document.getElementById('studentWorkLink').value = '';
    document.getElementById('studentWorkCategory').value = '';

    const addBtn = document.querySelector('[onclick*="updateStudentWork"]') || document.querySelector('[onclick="addStudentWork()"]');
    if (addBtn) {
        addBtn.onclick = function() { addStudentWork(); };
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Supervised Work';
        addBtn.classList.remove('edit-mode');
    }
}

async function importSpreadsheetStudentWorks() {
    const spreadsheetWorks = getSpreadsheetStudentWorks();

    if (!spreadsheetWorks.length) {
        showAlert('No supervised works found in assets/landing pages.xlsx', 'error');
        return;
    }

    try {
        showAlert('Importing supervised works...', 'success');

        const existingSnapshot = await db.collection('studentWorks').get();
        const existingKeys = new Set();
        existingSnapshot.forEach(doc => existingKeys.add(getStudentWorkKey(doc.data())));

        const batch = db.batch();
        let importedCount = 0;

        spreadsheetWorks.forEach(work => {
            if (existingKeys.has(getStudentWorkKey(work))) return;

            const ref = db.collection('studentWorks').doc();
            batch.set(ref, {
                name: work.name,
                description: work.description,
                link: work.link,
                category: work.category || 'Academic Output',
                source: work.source,
                userId: auth.currentUser.uid,
                createdAt: new Date()
            });
            importedCount++;
        });

        if (importedCount === 0) {
            showAlert('All landing pages.xlsx works are already in Firebase.', 'success');
            return;
        }

        await batch.commit();
        await db.collection('siteSettings').doc('studentWorks').set({ managed: true, updatedAt: new Date() }, { merge: true });
        showAlert(`Imported ${importedCount} supervised works.`, 'success');
        loadStudentWorks();
    } catch (error) {
        showAlert('Error importing supervised works: ' + error.message, 'error');
    }
}

async function addStudentWork() {
    const name = document.getElementById('studentWorkName').value.trim();
    const description = document.getElementById('studentWorkDescription').value.trim();
    const link = document.getElementById('studentWorkLink').value.trim();
    const category = document.getElementById('studentWorkCategory').value.trim() || 'Academic Output';

    if (!name || !description || !link) {
        showAlert('Please fill in name, description, and link', 'error');
        return;
    }

    try {
        new URL(link);
    } catch (e) {
        showAlert('Please enter a valid URL', 'error');
        return;
    }

    try {
        await db.collection('studentWorks').add({
            name,
            description,
            link,
            category,
            userId: auth.currentUser.uid,
            createdAt: new Date()
        });
        await db.collection('siteSettings').doc('studentWorks').set({ managed: true, updatedAt: new Date() }, { merge: true });

        showAlert('Supervised work added!', 'success');
        resetStudentWorkForm();
        loadStudentWorks();
    } catch (error) {
        showAlert('Error adding supervised work: ' + error.message, 'error');
    }
}

function loadStudentWorks() {
    const studentWorksList = document.getElementById('studentWorksAdminList');
    if (!studentWorksList) return;

    studentWorksList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    db.collection('studentWorks')
        .onSnapshot(async snapshot => {
            studentWorksList.innerHTML = '';

            const works = [];
            snapshot.forEach(doc => works.push({ id: doc.id, ...doc.data(), isFirestore: true }));

            if (!works.length) {
                const settingsDoc = await db.collection('siteSettings').doc('studentWorks').get();
                const managed = settingsDoc.exists && settingsDoc.data().managed;
                if (managed) {
                    studentWorksList.innerHTML = '<div class="empty-state"><p><i class="fas fa-inbox"></i> No supervised works yet. Add one above!</p></div>';
                    return;
                }

                getSpreadsheetStudentWorks().forEach(work => {
                    const workEl = document.createElement('div');
                    workEl.className = 'project-item';
                    workEl.innerHTML = `
                        <h4><i class="fas fa-user-graduate"></i> ${work.name}<span style="display: inline-block; margin-left: 8px; color: #22c55e; font-size: 12px;"><i class="fas fa-file-excel"></i> ${work.source}</span></h4>
                        <p>${work.description}</p>
                        <p><strong>Category:</strong> ${work.category || 'Academic Output'}</p>
                        <p><strong>Link:</strong> <a href="${work.link}" target="_blank" style="color: #1e88e5;">${work.link}</a></p>
                        <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="btn-primary-custom" onclick="importSpreadsheetStudentWorks()">
                                <i class="fas fa-file-import"></i> Import to Edit
                            </button>
                        </div>
                    `;
                    studentWorksList.appendChild(workEl);
                });
                return;
            }

            works.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            works.forEach(work => {
                const workEl = document.createElement('div');
                workEl.className = 'project-item';
                workEl.innerHTML = `
                    <h4><i class="fas fa-user-graduate"></i> ${work.name}</h4>
                    <p>${work.description}</p>
                    <p><strong>Category:</strong> ${work.category || 'Academic Output'}</p>
                    <p><strong>Link:</strong> <a href="${work.link}" target="_blank" style="color: #1e88e5;">${work.link}</a></p>
                    <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-primary-custom" onclick="editStudentWork('${work.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-danger-custom" onclick="deleteStudentWork('${work.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
                studentWorksList.appendChild(workEl);
            });
        }, error => {
            console.error('Error loading supervised works:', error);
            studentWorksList.innerHTML = '<div class="empty-state"><p>Error loading supervised works.</p></div>';
        });
}

function editStudentWork(workId) {
    db.collection('studentWorks').doc(workId).get().then(doc => {
        if (!doc.exists) return;

        const work = doc.data();
        document.getElementById('studentWorkName').value = work.name || '';
        document.getElementById('studentWorkDescription').value = work.description || '';
        document.getElementById('studentWorkLink').value = work.link || '';
        document.getElementById('studentWorkCategory').value = work.category || '';

        const addBtn = document.querySelector('[onclick="addStudentWork()"]');
        addBtn.onclick = function() { updateStudentWork(workId); };
        addBtn.innerHTML = '<i class="fas fa-save"></i> Update Supervised Work';
        addBtn.classList.add('edit-mode');
        document.getElementById('studentWorks').scrollIntoView({ behavior: 'smooth' });
    });
}

async function updateStudentWork(workId) {
    const name = document.getElementById('studentWorkName').value.trim();
    const description = document.getElementById('studentWorkDescription').value.trim();
    const link = document.getElementById('studentWorkLink').value.trim();
    const category = document.getElementById('studentWorkCategory').value.trim() || 'Academic Output';

    if (!name || !description || !link) {
        showAlert('Please fill in name, description, and link', 'error');
        return;
    }

    try {
        new URL(link);
        await db.collection('studentWorks').doc(workId).update({
            name,
            description,
            link,
            category,
            updatedAt: new Date()
        });
        await db.collection('siteSettings').doc('studentWorks').set({ managed: true, updatedAt: new Date() }, { merge: true });

        showAlert('Supervised work updated!', 'success');
        resetStudentWorkForm();
        loadStudentWorks();
    } catch (error) {
        showAlert('Error updating supervised work: ' + error.message, 'error');
    }
}

function deleteStudentWork(workId) {
    if (confirm('Delete this supervised work?')) {
        db.collection('studentWorks').doc(workId).delete()
            .then(() => db.collection('siteSettings').doc('studentWorks').set({ managed: true, updatedAt: new Date() }, { merge: true }))
            .then(() => {
                showAlert('Supervised work deleted!', 'success');
                loadStudentWorks();
            })
            .catch(error => showAlert('Error: ' + error.message, 'error'));
    }
}

// ===== CONTACT FUNCTIONS =====
function loadContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    db.collection('contacts')
        .onSnapshot(snapshot => {
            contactsList.innerHTML = '';

            if (snapshot.empty) {
                contactsList.innerHTML = '<div class="empty-state"><p><i class="fas fa-inbox"></i> No messages yet.</p></div>';
                return;
            }

            snapshot.forEach(doc => {
                const contact = doc.data();
                const date = new Date(contact.timestamp?.toDate()).toLocaleString();
                const contactEl = document.createElement('div');
                contactEl.className = 'contact-item';
                contactEl.innerHTML = `
                    <h4>${contact.name}</h4>
                    <p><strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #1e88e5;">${contact.email}</a></p>
                    <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Message:</strong></p>
                    <p>${contact.message}</p>
                    <button class="btn-danger-custom" onclick="deleteContact('${doc.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `;
                contactsList.appendChild(contactEl);
            });
        });
}

function deleteContact(contactId) {
    if (confirm('Delete this message?')) {
        db.collection('contacts').doc(contactId).delete()
            .then(() => {
                showAlert('Message deleted!', 'success');
                loadContacts();
            })
            .catch(error => {
                showAlert('Error: ' + error.message, 'error');
            });
    }
}

// ===== CERTIFICATE FUNCTIONS =====
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

function getDrivePreviewUrl(url) {
    const match = (url || '').match(/drive\.google\.com\/file\/d\/([^/]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

function sortCertificates(certificates) {
    return certificates.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

async function importSpreadsheetCertificates() {
    const spreadsheetCertificates = getSpreadsheetCertificates();

    if (!spreadsheetCertificates.length) {
        showAlert('No certificates found in assets/certs.xlsx', 'error');
        return;
    }

    try {
        showAlert('Importing certificates from certs.xlsx...', 'success');

        const existingSnapshot = await db.collection('certificates').get();
        const existingKeys = new Set();
        existingSnapshot.forEach(doc => existingKeys.add(getCertificateKey(doc.data())));

        let importedCount = 0;
        const batch = db.batch();

        spreadsheetCertificates.forEach(cert => {
            if (existingKeys.has(getCertificateKey(cert))) return;

            const ref = db.collection('certificates').doc();
            batch.set(ref, {
                name: cert.name,
                issuer: cert.issuer,
                date: cert.date,
                hours: cert.hours,
                fileUrl: cert.fileUrl,
                fileName: cert.fileName || 'Certificate PDF',
                fileType: cert.fileType || 'pdf',
                category: getCertificateCategory(cert),
                source: cert.source,
                userId: auth.currentUser.uid,
                createdAt: new Date(cert.date)
            });
            importedCount++;
        });

        if (importedCount === 0) {
            showAlert('All certs.xlsx certificates are already in Firebase.', 'success');
            return;
        }

        await batch.commit();
        await db.collection('siteSettings').doc('certificates').set({ managed: true, updatedAt: new Date() }, { merge: true });
        showAlert(`Imported ${importedCount} certificates from certs.xlsx.`, 'success');
        loadCertificates();
    } catch (error) {
        showAlert('Error importing certificates: ' + error.message, 'error');
    }
}

async function addCertificate() {
    const name = document.getElementById('certificateName').value.trim();
    const issuer = document.getElementById('certificateIssuer').value.trim();
    const date = document.getElementById('certificateDate').value;
    const hours = document.getElementById('certificateHours').value;
    const pdfUrl = document.getElementById('certificatePdfUrl').value.trim();

    if (!name || !issuer || !date || !hours || !pdfUrl) {
        showAlert('Please fill all fields and provide a PDF link', 'error');
        return;
    }

    // Validate URL format
    try {
        new URL(pdfUrl);
    } catch (e) {
        showAlert('⚠️ Please enter a valid URL', 'error');
        return;
    }

    try {
        showAlert('Adding certificate...', 'success');

        const certificateData = {
            name,
            issuer,
            date,
            hours: parseInt(hours),
            fileUrl: pdfUrl,
            fileName: pdfUrl.split('/').pop() || 'Certificate PDF',
            fileType: 'pdf',
            category: getCertificateCategory({ name, issuer }),
            userId: auth.currentUser.uid,
            createdAt: new Date()
        };

        await db.collection('certificates').add(certificateData);
        await db.collection('siteSettings').doc('certificates').set({ managed: true, updatedAt: new Date() }, { merge: true });
        
        showAlert('Certificate added successfully!', 'success');
        resetCertificateForm();
        loadCertificates();
    } catch (error) {
        showAlert('Error adding certificate: ' + error.message, 'error');
    }
}

function loadCertificates() {
    const certificatesList = document.getElementById('certificatesList');
    certificatesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    db.collection('certificates')
        .orderBy('createdAt', 'desc')
        .onSnapshot(async snapshot => {
            certificatesList.innerHTML = '';

            const certificates = [];
            const seen = new Set();

            snapshot.forEach(doc => {
                const cert = { id: doc.id, ...doc.data(), isFirestore: true };
                certificates.push(cert);
                seen.add(getCertificateKey(cert));
            });

            const settingsDoc = await db.collection('siteSettings').doc('certificates').get();
            const managed = settingsDoc.exists && settingsDoc.data().managed;

            if (!managed) {
                getSpreadsheetCertificates().forEach(cert => {
                    if (!seen.has(getCertificateKey(cert))) {
                        certificates.push(cert);
                    }
                });
            }

            if (!certificates.length) {
                certificatesList.innerHTML = `<div class="empty-state"><p><i class="fas fa-inbox"></i> No certificates yet. ${managed ? 'Add one above!' : 'Add one above or import certs.xlsx!'}</p></div>`;
                return;
            }

            sortCertificates(certificates).forEach(cert => {
                const dateObj = new Date(cert.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const category = getCertificateCategory(cert);
                const sourceBadge = cert.source ? `<span style="display: inline-block; margin-left: 8px; color: #22c55e; font-size: 12px;"><i class="fas fa-file-excel"></i> ${cert.source}</span>` : '';
                const categoryBadge = `<span class="admin-cert-category"><i class="${getCertificateCategoryIcon(category)}"></i> ${category}</span>`;
                const deleteButton = cert.isFirestore ? `
                        <button class="btn-primary-custom" onclick="editCertificate('${cert.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-danger-custom" onclick="deleteCertificate('${cert.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : '';
                
                const certEl = document.createElement('div');
                certEl.className = 'certificate-item';
                certEl.innerHTML = `
                    <div class="certificate-info">
                        <h4><i class="fas fa-certificate"></i> ${cert.name}${sourceBadge}</h4>
                        ${categoryBadge}
                        <p><strong>Issued By:</strong> ${cert.issuer}</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Training Hours:</strong> ${cert.hours} hours</p>
                    </div>
                    <div class="certificate-actions">
                        <button class="btn-primary-custom" onclick="previewCertificate('${cert.id}')">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        ${deleteButton}
                    </div>
                `;
                certificatesList.appendChild(certEl);
            });
        }, error => {
            console.error('Error loading certificates:', error);
            const spreadsheetCertificates = sortCertificates(getSpreadsheetCertificates());
            certificatesList.innerHTML = '';
            spreadsheetCertificates.forEach(cert => {
                const dateObj = new Date(cert.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const category = getCertificateCategory(cert);
                const certEl = document.createElement('div');
                certEl.className = 'certificate-item';
                certEl.innerHTML = `
                    <div class="certificate-info">
                        <h4><i class="fas fa-certificate"></i> ${cert.name}<span style="display: inline-block; margin-left: 8px; color: #22c55e; font-size: 12px;"><i class="fas fa-file-excel"></i> ${cert.source}</span></h4>
                        <span class="admin-cert-category"><i class="${getCertificateCategoryIcon(category)}"></i> ${category}</span>
                        <p><strong>Issued By:</strong> ${cert.issuer}</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Training Hours:</strong> ${cert.hours} hours</p>
                    </div>
                    <div class="certificate-actions">
                        <button class="btn-primary-custom" onclick="previewCertificate('${cert.id}')">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                    </div>
                `;
                certificatesList.appendChild(certEl);
            });
        });
}

function previewCertificate(certificateId) {
    if (certificateId.startsWith('spreadsheet-')) {
        const cert = getSpreadsheetCertificates().find(item => item.id === certificateId);
        if (cert) showCertificatePreviewModal(cert);
        return;
    }

    db.collection('certificates').doc(certificateId).get().then(doc => {
        if (doc.exists) {
            showCertificatePreviewModal(doc.data());
        }
    }).catch(error => {
        showAlert('Error loading certificate: ' + error.message, 'error');
    });
}

function showCertificatePreviewModal(cert) {
    const modal = document.createElement('div');
    const previewUrl = getDrivePreviewUrl(cert.fileUrl);
    modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            `;

    modal.innerHTML = `
                <div style="background: #1a2a4e; border: 2px solid #1e88e5; border-radius: 12px; max-width: 90%;  max-height: 90%; overflow: auto; padding: 20px; position: relative; box-shadow: 0 8px 32px rgba(30, 136, 229, 0.3);">
                    <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: #ff5722; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-times"></i></button>
                    
                    <h2 style="color: #1e88e5; margin-bottom: 15px; margin-top: 0;"><i class="fas fa-certificate"></i> ${cert.name}</h2>
                    <p style="color: #e8eef7; margin: 5px 0;"><strong style="color: #1e88e5;">Issued By:</strong> ${cert.issuer}</p>
                    <p style="color: #e8eef7; margin: 5px 0;"><strong style="color: #1e88e5;">Category:</strong> ${getCertificateCategory(cert)}</p>
                    <p style="color: #e8eef7; margin: 5px 0;"><strong style="color: #1e88e5;">Date:</strong> ${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p style="color: #e8eef7; margin: 5px 0;"><strong style="color: #1e88e5;">Training Hours:</strong> ${cert.hours} hours</p>
                    
                    <div style="margin-top: 20px; border-top: 1px solid rgba(30, 136, 229, 0.3); padding-top: 20px;">
                        ${cert.fileType === 'pdf' 
                            ? `<iframe src="${previewUrl}" style="width: 100%; height: 600px; border-radius: 8px; border: 1px solid rgba(30, 136, 229, 0.3);" frameborder="0"></iframe>`
                            : `<img src="${cert.fileUrl}" style="max-width: 100%; max-height: 600px; border-radius: 8px; border: 1px solid rgba(30, 136, 229, 0.3);">`
                        }
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${cert.fileUrl}" target="_blank" class="btn-primary-custom" style="display: inline-block; text-decoration: none;">
                            <i class="fas fa-download"></i> Download
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

function resetCertificateForm() {
    document.getElementById('certificateName').value = '';
    document.getElementById('certificateIssuer').value = '';
    document.getElementById('certificateDate').value = '';
    document.getElementById('certificateHours').value = '';
    document.getElementById('certificatePdfUrl').value = '';

    const addBtn = document.querySelector('[onclick*="updateCertificate"]') || document.querySelector('[onclick="addCertificate()"]');
    if (addBtn) {
        addBtn.onclick = function() { addCertificate(); };
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Certificate';
        addBtn.classList.remove('edit-mode');
    }
}

function editCertificate(certificateId) {
    db.collection('certificates').doc(certificateId).get().then(doc => {
        if (!doc.exists) return;

        const cert = doc.data();
        document.getElementById('certificateName').value = cert.name || '';
        document.getElementById('certificateIssuer').value = cert.issuer || '';
        document.getElementById('certificateDate').value = cert.date || '';
        document.getElementById('certificateHours').value = cert.hours || '';
        document.getElementById('certificatePdfUrl').value = cert.fileUrl || '';

        const addBtn = document.querySelector('[onclick="addCertificate()"]');
        addBtn.onclick = function() { updateCertificate(certificateId); };
        addBtn.innerHTML = '<i class="fas fa-save"></i> Update Certificate';
        addBtn.classList.add('edit-mode');
        document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' });
    });
}

async function updateCertificate(certificateId) {
    const name = document.getElementById('certificateName').value.trim();
    const issuer = document.getElementById('certificateIssuer').value.trim();
    const date = document.getElementById('certificateDate').value;
    const hours = document.getElementById('certificateHours').value;
    const pdfUrl = document.getElementById('certificatePdfUrl').value.trim();

    if (!name || !issuer || !date || !hours || !pdfUrl) {
        showAlert('Please fill all fields and provide a PDF link', 'error');
        return;
    }

    try {
        new URL(pdfUrl);

        await db.collection('certificates').doc(certificateId).update({
            name,
            issuer,
            date,
            hours: parseInt(hours),
            fileUrl: pdfUrl,
            fileName: pdfUrl.split('/').pop() || 'Certificate PDF',
            fileType: 'pdf',
            category: getCertificateCategory({ name, issuer }),
            updatedAt: new Date()
        });
        await db.collection('siteSettings').doc('certificates').set({ managed: true, updatedAt: new Date() }, { merge: true });

        showAlert('Certificate updated successfully!', 'success');
        resetCertificateForm();
        loadCertificates();
    } catch (error) {
        showAlert('Error updating certificate: ' + error.message, 'error');
    }
}

function deleteCertificate(certificateId) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        db.collection('certificates').doc(certificateId).delete()
            .then(() => db.collection('siteSettings').doc('certificates').set({ managed: true, updatedAt: new Date() }, { merge: true }))
            .then(() => {
                showAlert('Certificate deleted!', 'success');
                loadCertificates();
            })
            .catch(error => {
                showAlert('Error: ' + error.message, 'error');
            });
    }
}

// ===== UTILITY FUNCTIONS =====
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'error'}">${message}</div>`;
    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 4000);
}

function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'error'}">${message}</div>`;
}

// Initialize Firebase listeners
auth.onAuthStateChanged(user => {
    if (user) {
        showDashboard();
        loadDashboardData();
    } else {
        showLogin();
    }
});
