document.addEventListener('DOMContentLoaded', () => {
    // Student database
    let studentsDatabase = [];
    
    // Admin credentials
    const ADMIN_PASSWORD = 'admin123';
    let isAdminLoggedIn = false;
    let currentStudent = null;

    // Data structure to store content
    let contentData = {
        BCA: {
            1: { notes: [], books: [], papers: [], videos: [] },
            2: { notes: [], books: [], papers: [], videos: [] },
            3: { notes: [], books: [], papers: [], videos: [] },
            4: { notes: [], books: [], papers: [], videos: [] },
            5: { notes: [], books: [], papers: [], videos: [] },
            6: { notes: [], books: [], papers: [], videos: [] }
        },
        MCA: {
            1: { notes: [], books: [], papers: [], videos: [] },
            2: { notes: [], books: [], papers: [], videos: [] },
            3: { notes: [], books: [], papers: [], videos: [] },
            4: { notes: [], books: [], papers: [], videos: [] }
        },
        BTech: {
            1: { notes: [], books: [], papers: [], videos: [] },
            2: { notes: [], books: [], papers: [], videos: [] },
            3: { notes: [], books: [], papers: [], videos: [] },
            4: { notes: [], books: [], papers: [], videos: [] },
            5: { notes: [], books: [], papers: [], videos: [] },
            6: { notes: [], books: [], papers: [], videos: [] },
            7: { notes: [], books: [], papers: [], videos: [] },
            8: { notes: [], books: [], papers: [], videos: [] }
        },
        MTech: {
            1: { notes: [], books: [], papers: [], videos: [] },
            2: { notes: [], books: [], papers: [], videos: [] },
            3: { notes: [], books: [], papers: [], videos: [] },
            4: { notes: [], books: [], papers: [], videos: [] }
        }
    };

    let currentCourse = '';
    let currentSemester = '';

    // Sample data initialization
    function initializeSampleData() {
        // Sample content data
        contentData.BCA[1].notes.push({
            id: 1,
            title: "Programming Fundamentals",
            subject: "Computer Programming",
            type: "notes",
            uploadDate: "2024-01-15",
            size: "2.5 MB"
        });
        
        contentData.BCA[1].books.push({
            id: 2,
            title: "C Programming Complete Guide",
            subject: "Computer Programming",
            type: "books",
            uploadDate: "2024-01-10",
            size: "15.2 MB"
        });
        
        contentData.MCA[1].papers.push({
            id: 3,
            title: "Data Structures - Previous Year Paper 2023",
            subject: "Data Structures",
            type: "papers",
            uploadDate: "2024-01-20",
            size: "1.8 MB"
        });

        // Sample student data with some pending approvals
        studentsDatabase.push({
            id: 1,
            studentId: 'BCA2024001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1234567890',
            dob: '2000-05-15',
            course: 'BCA',
            semester: 3,
            address: '123 Main Street, City, State',
            registrationDate: '2024-01-10',
            status: 'Approved'
        });

        studentsDatabase.push({
            id: 2,
            studentId: 'MCA2024001',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '+1234567891',
            dob: '1999-08-22',
            course: 'MCA',
            semester: 2,
            address: '456 Oak Avenue, City, State',
            registrationDate: '2024-01-12',
            status: 'Pending'
        });

        studentsDatabase.push({
            id: 3,
            studentId: 'BTECH2024001',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@email.com',
            phone: '+1234567892',
            dob: '2001-03-10',
            course: 'BTech',
            semester: 4,
            address: '789 Pine Road, City, State',
            registrationDate: '2024-01-15',
            status: 'Pending'
        });
    }

    // Initialize
    initializeSampleData();
    updateTotalFiles();
    updateStudentCounts();

    // Landing page navigation
    document.getElementById('studentAccessBtn').addEventListener('click', () => {
        document.getElementById('studentLoginModal').classList.remove('hidden');
    });

    document.getElementById('adminAccessBtn').addEventListener('click', () => {
        document.getElementById('adminLoginModal').classList.remove('hidden');
    });

    document.getElementById('registerBtn').addEventListener('click', () => {
        document.getElementById('registrationModal').classList.remove('hidden');
    });

    // Student login functionality
    document.getElementById('studentLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const studentId = document.getElementById('studentLoginId').value;
        const email = document.getElementById('studentLoginEmail').value;
        const errorDiv = document.getElementById('studentLoginError');
        const errorText = document.getElementById('studentLoginErrorText');
        
        // Find student in database
        const student = studentsDatabase.find(s => 
            s.studentId === studentId && s.email === email
        );
        
        if (!student) {
            errorText.textContent = 'Invalid Student ID or Email. Please check your credentials.';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        if (student.status !== 'Approved') {
            errorText.textContent = 'Your account is pending approval. Please contact the admin.';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        // Login successful
        currentStudent = student;
        document.getElementById('studentLoginModal').classList.add('hidden');
        document.getElementById('studentLoginForm').reset();
        errorDiv.classList.add('hidden');
        
        // Show student portal
        showStudentPortal();
    });

    document.getElementById('cancelStudentLogin').addEventListener('click', () => {
        document.getElementById('studentLoginModal').classList.add('hidden');
        document.getElementById('studentLoginForm').reset();
        document.getElementById('studentLoginError').classList.add('hidden');
    });

    // Admin login functionality
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        if (password === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            document.getElementById('adminLoginModal').classList.add('hidden');
            document.getElementById('adminPassword').value = '';
            errorDiv.classList.add('hidden');
            showAdminPanel();
        } else {
            errorDiv.classList.remove('hidden');
            document.getElementById('adminPassword').value = '';
        }
    });

    document.getElementById('cancelAdminLogin').addEventListener('click', () => {
        document.getElementById('adminLoginModal').classList.add('hidden');
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').classList.add('hidden');
    });

    // Registration functionality
    document.getElementById('regCourse').addEventListener('change', (e) => {
        const course = e.target.value;
        const semesterSelect = document.getElementById('regSemester');
        const semesterCount = getSemesterCount(course);
        
        semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        for (let i = 1; i <= semesterCount; i++) {
            semesterSelect.innerHTML += `<option value="${i}">Semester ${i}</option>`;
        }
    });

    document.getElementById('registrationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            id: studentsDatabase.length + 1,
            studentId: document.getElementById('studentId').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            dob: document.getElementById('dob').value,
            course: document.getElementById('regCourse').value,
            semester: parseInt(document.getElementById('regSemester').value),
            address: document.getElementById('address').value,
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };

        // Check if student ID already exists
        const existingStudent = studentsDatabase.find(student => student.studentId === formData.studentId);
        if (existingStudent) {
            alert('Student ID already exists. Please use a different ID.');
            return;
        }

        // Check if email already exists
        const existingEmail = studentsDatabase.find(student => student.email === formData.email);
        if (existingEmail) {
            alert('Email already registered. Please use a different email.');
            return;
        }
        
        // Add student to database
        studentsDatabase.push(formData);
        updateStudentCounts();

        // Close modal and reset form
        document.getElementById('registrationModal').classList.add('hidden');
        document.getElementById('registrationForm').reset();

        // Show success message
        alert(`Registration submitted successfully! Your Student ID is: ${formData.studentId}. Please wait for admin approval to access the portal.`);
    });

    document.getElementById('closeRegModal').addEventListener('click', () => {
        document.getElementById('registrationModal').classList.add('hidden');
    });

    document.getElementById('cancelRegModal').addEventListener('click', () => {
        document.getElementById('registrationModal').classList.add('hidden');
    });

    // Show student portal
    function showStudentPortal() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('studentPortal').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
        
        document.getElementById('studentWelcome').textContent = `Welcome, ${currentStudent.firstName} ${currentStudent.lastName}`;
        showStudentCourse();
    }

    function showStudentCourse() {
        const courseCardContainer = document.getElementById('studentCourseCard');
        courseCardContainer.innerHTML = `
            <div class="course-card bg-white rounded-xl shadow-lg p-8 hover-scale cursor-pointer border-l-4 ${getCourseColor(currentStudent.course)}" data-course="${currentStudent.course}">
                <div class="text-center">
                    <i class="fas ${getCourseIcon(currentStudent.course)} text-5xl ${getCourseTextColor(currentStudent.course)} mb-6"></i>
                    <h3 class="text-2xl font-bold text-gray-800 mb-3">${currentStudent.course}</h3>
                    <p class="text-gray-600 mb-4">${getCourseName(currentStudent.course)}</p>
                    <p class="text-lg ${getCourseTextColor(currentStudent.course)} font-semibold">Current Semester: ${currentStudent.semester}</p>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <p class="text-sm text-gray-500">Click to access course materials</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler for the enrolled course
        document.querySelector('.course-card').addEventListener('click', () => {
            currentCourse = currentStudent.course;
            showSemesterSelection();
        });

        // Reset views
        document.getElementById('courseSelection').classList.remove('hidden');
        document.getElementById('semesterSelection').classList.add('hidden');
        document.getElementById('contentBrowser').classList.add('hidden');
    }

    // Show admin panel
    function showAdminPanel() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('studentPortal').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminContent();
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        currentStudent = null;
        document.getElementById('landingPage').classList.remove('hidden');
        document.getElementById('studentPortal').classList.add('hidden');
    });

    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
        isAdminLoggedIn = false;
        document.getElementById('landingPage').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
    });

    // Admin functionality
    document.getElementById('approveStudentsBtn').addEventListener('click', () => {
        document.getElementById('approvalModal').classList.remove('hidden');
        loadPendingStudents();
    });

    document.getElementById('viewStudentsBtn').addEventListener('click', () => {
        document.getElementById('studentDatabaseModal').classList.remove('hidden');
        loadStudentDatabase();
    });

    document.getElementById('addContentBtn').addEventListener('click', () => {
        document.getElementById('addContentModal').classList.remove('hidden');
    });

    // Modal close handlers
    document.getElementById('closeApprovalModal').addEventListener('click', () => {
        document.getElementById('approvalModal').classList.add('hidden');
    });

    document.getElementById('closeStudentDB').addEventListener('click', () => {
        document.getElementById('studentDatabaseModal').classList.add('hidden');
    });

    document.getElementById('closeContentModal').addEventListener('click', () => {
        document.getElementById('addContentModal').classList.add('hidden');
    });

    document.getElementById('cancelContentModal').addEventListener('click', () => {
        document.getElementById('addContentModal').classList.add('hidden');
    });

    // Course change in content modal
    document.getElementById('modalCourse').addEventListener('change', (e) => {
        const course = e.target.value;
        const semesterSelect = document.getElementById('modalSemester');
        const semesterCount = getSemesterCount(course);
        
        semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        for (let i = 1; i <= semesterCount; i++) {
            semesterSelect.innerHTML += `<option value="${i}">Semester ${i}</option>`;
        }
    });

    // Add content form submission
    document.getElementById('addContentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const course = document.getElementById('modalCourse').value;
        const semester = parseInt(document.getElementById('modalSemester').value);
        const type = document.getElementById('modalType').value;
        const title = document.getElementById('modalTitle').value;
        const subject = document.getElementById('modalSubject').value;
        
        const newContent = {
            id: Date.now(),
            title: title,
            subject: subject,
            type: type,
            uploadDate: new Date().toISOString().split('T')[0],
            size: "2.5 MB" // Demo size
        };
        
        contentData[course][semester][type].push(newContent);
        updateTotalFiles();
        loadAdminContent();
        
        document.getElementById('addContentModal').classList.add('hidden');
        document.getElementById('addContentForm').reset();
        
        alert('Content added successfully!');
    });

    // Student portal navigation
    document.getElementById('backToCourses').addEventListener('click', showStudentCourse);
    document.getElementById('backToSemesters').addEventListener('click', showSemesterSelection);

    function showSemesterSelection() {
        document.getElementById('courseSelection').classList.add('hidden');
        document.getElementById('semesterSelection').classList.remove('hidden');
        document.getElementById('contentBrowser').classList.add('hidden');
        
        const semesterGrid = document.getElementById('semesterGrid');
        const semesterCount = getSemesterCount(currentCourse);
        
        semesterGrid.innerHTML = '';
        for (let i = 1; i <= semesterCount; i++) {
            const semesterCard = document.createElement('div');
            semesterCard.className = 'bg-white rounded-xl shadow-lg p-6 hover-scale cursor-pointer border-l-4 border-blue-500';
            semesterCard.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-calendar-alt text-4xl text-blue-600 mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-800">Semester ${i}</h3>
                    <p class="text-sm text-gray-600 mt-2">${getTotalContentCount(currentCourse, i)} materials</p>
                </div>
            `;
            semesterCard.addEventListener('click', () => {
                currentSemester = i;
                showContentBrowser();
            });
            semesterGrid.appendChild(semesterCard);
        }
    }

    function showContentBrowser() {
        document.getElementById('courseSelection').classList.add('hidden');
        document.getElementById('semesterSelection').classList.add('hidden');
        document.getElementById('contentBrowser').classList.remove('hidden');
        
        document.getElementById('contentTitle').textContent = `${currentCourse} - Semester ${currentSemester}`;
        updateContentCounts();
        loadContent();
    }

    // Content type filtering
    document.querySelectorAll('.content-type-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            document.getElementById('filterType').value = type;
            loadContent(type, document.getElementById('searchInput').value);
        });
    });

    // Search and filter
    document.getElementById('searchInput').addEventListener('input', (e) => {
        loadContent(document.getElementById('filterType').value, e.target.value);
    });

    document.getElementById('filterType').addEventListener('change', (e) => {
        loadContent(e.target.value, document.getElementById('searchInput').value);
    });

    function loadPendingStudents() {
        const pendingStudentsList = document.getElementById('pendingStudentsList');
        const noPendingStudents = document.getElementById('noPendingStudents');
        const pendingStudents = studentsDatabase.filter(student => student.status === 'Pending');

        if (pendingStudents.length === 0) {
            pendingStudentsList.innerHTML = '';
            noPendingStudents.classList.remove('hidden');
            return;
        }

        noPendingStudents.classList.add('hidden');
        pendingStudentsList.innerHTML = '';

        pendingStudents.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow';
            studentCard.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="bg-orange-100 rounded-full p-3">
                            <i class="fas fa-user-graduate text-2xl text-orange-600"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-lg font-semibold text-gray-800">${student.firstName} ${student.lastName}</h4>
                            <div class="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                                <div><i class="fas fa-id-card mr-2"></i><strong>Student ID:</strong> ${student.studentId}</div>
                                <div><i class="fas fa-envelope mr-2"></i><strong>Email:</strong> ${student.email}</div>
                                <div><i class="fas fa-graduation-cap mr-2"></i><strong>Course:</strong> ${student.course} - Semester ${student.semester}</div>
                                <div><i class="fas fa-calendar mr-2"></i><strong>Applied:</strong> ${student.registrationDate}</div>
                            </div>
                            <div class="mt-2 text-sm text-gray-600">
                                <i class="fas fa-phone mr-2"></i><strong>Phone:</strong> ${student.phone}
                            </div>
                            ${student.address ? `<div class="mt-1 text-sm text-gray-600"><i class="fas fa-map-marker-alt mr-2"></i><strong>Address:</strong> ${student.address}</div>` : ''}
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <button class="approve-btn px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" data-student-id="${student.id}">
                            <i class="fas fa-check mr-2"></i>Approve
                        </button>
                        <button class="reject-btn px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" data-student-id="${student.id}">
                            <i class="fas fa-times mr-2"></i>Reject
                        </button>
                    </div>
                </div>
            `;
            pendingStudentsList.appendChild(studentCard);
        });

        // Add event listeners for approval buttons
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studentId = parseInt(e.target.closest('.approve-btn').dataset.studentId);
                approveStudent(studentId);
            });
        });

        // Add event listeners for reject buttons
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studentId = parseInt(e.target.closest('.reject-btn').dataset.studentId);
                rejectStudent(studentId);
            });
        });
    }

    function approveStudent(studentId) {
        const student = studentsDatabase.find(s => s.id === studentId);
        if (student) {
            student.status = 'Approved';
            
            // Show success animation
            const studentCard = document.querySelector(`[data-student-id="${studentId}"]`).closest('.bg-white');
            studentCard.classList.add('bg-green-50', 'border-green-200');
            studentCard.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-check-circle text-4xl text-green-600 mb-3"></i>
                    <h4 class="text-lg font-semibold text-green-800">${student.firstName} ${student.lastName} Approved!</h4>
                    <p class="text-green-600">Student can now access their course materials</p>
                </div>
            `;
            
            // Remove the card after animation
            setTimeout(() => {
                loadPendingStudents();
                updateStudentCounts();
            }, 2000);
            
            // Show success notification
            showNotification(`${student.firstName} ${student.lastName} has been approved successfully!`, 'success');
        }
    }

    function rejectStudent(studentId) {
        const student = studentsDatabase.find(s => s.id === studentId);
        if (student && confirm(`Are you sure you want to reject ${student.firstName} ${student.lastName}'s registration?`)) {
            // Remove student from database
            studentsDatabase = studentsDatabase.filter(s => s.id !== studentId);
            loadPendingStudents();
            updateStudentCounts();
            showNotification(`${student.firstName} ${student.lastName}'s registration has been rejected.`, 'error');
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Utility functions
    function getSemesterCount(course) {
        const counts = { BCA: 6, MCA: 4, BTech: 8, MTech: 4 };
        return counts[course] || 0;
    }

    function getCourseColor(course) {
        const colors = {
            'BCA': 'border-blue-500',
            'MCA': 'border-green-500',
            'BTech': 'border-purple-500',
            'MTech': 'border-red-500'
        };
        return colors[course] || 'border-gray-500';
    }

    function getCourseTextColor(course) {
        const colors = {
            'BCA': 'text-blue-600',
            'MCA': 'text-green-600',
            'BTech': 'text-purple-600',
            'MTech': 'text-red-600'
        };
        return colors[course] || 'text-gray-600';
    }

    function getCourseIcon(course) {
        const icons = {
            'BCA': 'fa-laptop-code',
            'MCA': 'fa-code',
            'BTech': 'fa-cogs',
            'MTech': 'fa-microchip'
        };
        return icons[course] || 'fa-graduation-cap';
    }

    function getCourseName(course) {
        const names = {
            'BCA': 'Bachelor of Computer Applications',
            'MCA': 'Master of Computer Applications',
            'BTech': 'Bachelor of Technology',
            'MTech': 'Master of Technology'
        };
        return names[course] || course;
    }

    function getTotalContentCount(course, semester) {
        const data = contentData[course][semester];
        return data.notes.length + data.books.length + data.papers.length + data.videos.length;
    }

    function updateContentCounts() {
        const data = contentData[currentCourse][currentSemester];
        document.getElementById('notesCount').textContent = `${data.notes.length} files`;
        document.getElementById('booksCount').textContent = `${data.books.length} files`;
        document.getElementById('papersCount').textContent = `${data.papers.length} files`;
        document.getElementById('videosCount').textContent = `${data.videos.length} files`;
    }

    function loadContent(filterType = 'all', searchTerm = '') {
        const contentList = document.getElementById('contentList');
        const data = contentData[currentCourse][currentSemester];
        let allContent = [];

        if (filterType === 'all' || filterType === 'notes') allContent = allContent.concat(data.notes);
        if (filterType === 'all' || filterType === 'books') allContent = allContent.concat(data.books);
        if (filterType === 'all' || filterType === 'papers') allContent = allContent.concat(data.papers);
        if (filterType === 'all' || filterType === 'videos') allContent = allContent.concat(data.videos);

        if (searchTerm) {
            allContent = allContent.filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.subject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        contentList.innerHTML = '';
        
        if (allContent.length === 0) {
            contentList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
                    <p class="text-xl text-gray-500">No content available</p>
                    <p class="text-gray-400">Check back later for updates</p>
                </div>
            `;
            return;
        }

        allContent.forEach(item => {
            const contentItem = document.createElement('div');
            contentItem.className = 'bg-white rounded-lg shadow-md p-4 hover-scale cursor-pointer border-l-4 ' + getTypeColor(item.type);
            contentItem.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas ${getTypeIcon(item.type)} text-2xl ${getTypeTextColor(item.type)} mr-4"></i>
                        <div>
                            <h4 class="text-lg font-semibold text-gray-800">${item.title}</h4>
                            <p class="text-gray-600">${item.subject}</p>
                            <p class="text-sm text-gray-500">Uploaded: ${item.uploadDate} • Size: ${item.size}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">${item.type}</span>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-download mr-2"></i>Download
                        </button>
                    </div>
                </div>
            `;
            contentList.appendChild(contentItem);
        });
    }

    function getTypeColor(type) {
        const colors = {
            notes: 'border-blue-500',
            books: 'border-green-500',
            papers: 'border-purple-500',
            videos: 'border-red-500'
        };
        return colors[type] || 'border-gray-500';
    }

    function getTypeTextColor(type) {
        const colors = {
            notes: 'text-blue-600',
            books: 'text-green-600',
            papers: 'text-purple-600',
            videos: 'text-red-600'
        };
        return colors[type] || 'text-gray-600';
    }

    function getTypeIcon(type) {
        const icons = {
            notes: 'fa-sticky-note',
            books: 'fa-book',
            papers: 'fa-file-alt',
            videos: 'fa-play-circle'
        };
        return icons[type] || 'fa-file';
    }

    function updateTotalFiles() {
        let total = 0;
        Object.keys(contentData).forEach(course => {
            Object.keys(contentData[course]).forEach(semester => {
                Object.keys(contentData[course][semester]).forEach(type => {
                    total += contentData[course][semester][type].length;
                });
            });
        });
        document.getElementById('totalFiles').textContent = total;
    }

    function updateStudentCounts() {
        const totalStudents = studentsDatabase.length;
        const pendingStudents = studentsDatabase.filter(s => s.status === 'Pending').length;
        
        document.getElementById('dashboardStudentCount').textContent = totalStudents;
        document.getElementById('pendingApprovalsCount').textContent = pendingStudents;
        if (document.getElementById('totalStudentsCount')) {
            document.getElementById('totalStudentsCount').textContent = totalStudents;
        }
        
        // Update pending badge
        const pendingBadge = document.getElementById('pendingBadge');
        if (pendingStudents > 0) {
            pendingBadge.textContent = pendingStudents;
            pendingBadge.classList.remove('hidden');
        } else {
            pendingBadge.classList.add('hidden');
        }
    }

    function loadStudentDatabase(searchTerm = '', courseFilter = 'all') {
        const tableBody = document.getElementById('studentsTableBody');
        let filteredStudents = studentsDatabase;

        // Apply filters
        if (searchTerm) {
            filteredStudents = filteredStudents.filter(student => 
                student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (courseFilter !== 'all') {
            filteredStudents = filteredStudents.filter(student => student.course === courseFilter);
        }

        tableBody.innerHTML = '';

        if (filteredStudents.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
                        <i class="fas fa-users text-4xl mb-2"></i>
                        <p>No students found</p>
                    </td>
                </tr>
            `;
            return;
        }

        filteredStudents.forEach(student => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="border border-gray-300 px-4 py-2">${student.studentId}</td>
                <td class="border border-gray-300 px-4 py-2">${student.firstName} ${student.lastName}</td>
                <td class="border border-gray-300 px-4 py-2">${student.email}</td>
                <td class="border border-gray-300 px-4 py-2">${student.course}</td>
                <td class="border border-gray-300 px-4 py-2">Semester ${student.semester}</td>
                <td class="border border-gray-300 px-4 py-2">
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(student.status)}">
                        ${student.status}
                    </span>
                </td>
                <td class="border border-gray-300 px-4 py-2">${student.registrationDate}</td>
                <td class="border border-gray-300 px-4 py-2">
                    <div class="flex space-x-1">
                        ${student.status === 'Pending' ? 
                            `<button class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700" onclick="approveStudentFromDB(${student.id})" title="Approve">
                                <i class="fas fa-check"></i>
                            </button>` : ''
                        }
                        <button class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700" onclick="deleteStudent(${student.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        updateStudentCounts();
    }
    
    // Make functions globally accessible for inline onclick handlers
    window.approveStudentFromDB = (studentId) => {
        const student = studentsDatabase.find(s => s.id === studentId);
        if (student && confirm(`Approve ${student.firstName} ${student.lastName}?`)) {
            student.status = 'Approved';
            loadStudentDatabase(document.getElementById('searchStudents').value, document.getElementById('filterCourse').value);
            showNotification(`${student.firstName} ${student.lastName} has been approved and can now access the portal.`, 'success');
        }
    }

    window.deleteStudent = (studentId) => {
        const student = studentsDatabase.find(s => s.id === studentId);
        if (student && confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
            studentsDatabase = studentsDatabase.filter(s => s.id !== studentId);
            loadStudentDatabase(document.getElementById('searchStudents').value, document.getElementById('filterCourse').value);
            updateStudentCounts();
            
            // If this student is currently logged in, log them out
            if (currentStudent && currentStudent.id === studentId) {
                currentStudent = null;
                document.getElementById('landingPage').classList.remove('hidden');
                document.getElementById('studentPortal').classList.add('hidden');
            }
        }
    }


    function getStatusColor(status) {
        const colors = {
            'Approved': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Suspended': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    function loadAdminContent() {
        const adminContentList = document.getElementById('adminContentList');
        let allContent = [];

        Object.keys(contentData).forEach(course => {
            Object.keys(contentData[course]).forEach(semester => {
                Object.keys(contentData[course][semester]).forEach(type => {
                    contentData[course][semester][type].forEach(item => {
                        allContent.push({
                            ...item,
                            course: course,
                            semester: semester
                        });
                    });
                });
            });
        });

        adminContentList.innerHTML = '';
        
        if (allContent.length === 0) {
            adminContentList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
                    <p class="text-xl text-gray-500">No content uploaded yet</p>
                    <p class="text-gray-400">Start by adding some educational materials</p>
                </div>
            `;
            return;
        }

        allContent.forEach(item => {
            const adminItem = document.createElement('div');
            adminItem.className = 'bg-gray-50 rounded-lg p-4 border border-gray-200';
            adminItem.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas ${getTypeIcon(item.type)} text-2xl ${getTypeTextColor(item.type)} mr-4"></i>
                        <div>
                            <h4 class="text-lg font-semibold text-gray-800">${item.title}</h4>
                            <p class="text-gray-600">${item.subject} • ${item.course} Semester ${item.semester}</p>
                            <p class="text-sm text-gray-500">Uploaded: ${item.uploadDate} • Size: ${item.size}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">${item.type}</span>
                        <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            adminContentList.appendChild(adminItem);
        });
    }

    // Student database search and filter
    document.getElementById('searchStudents').addEventListener('input', (e) => {
        loadStudentDatabase(e.target.value, document.getElementById('filterCourse').value);
    });

    document.getElementById('filterCourse').addEventListener('change', (e) => {
        loadStudentDatabase(document.getElementById('searchStudents').value, e.target.value);
    });
});